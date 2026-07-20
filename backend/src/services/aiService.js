import { GoogleGenAI } from "@google/genai";

function getClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Plain JSON Schema describing the tailored resume + match analysis.
// Passed as responseSchema so Gemini is constrained to return valid,
// parseable JSON instead of free text we'd have to guess at.
const RESUME_SCHEMA = {
  type: "object",
  properties: {
    contact: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        location: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" },
        website: { type: "string" },
      },
      required: ["name"],
    },
    title: {
      type: "string",
      description:
        "A professional headline for the candidate matched to the target role, e.g. 'Senior Backend Engineer'.",
    },
    summary: {
      type: "string",
      description:
        "3-4 sentence professional summary rewritten to mirror the language and priorities of the job description, using only truthful information from the candidate's original resume.",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description:
        "Flat ordered list of skills, prioritizing ones that appear in both the resume and the job description. Always populate this even if skillCategories is also used.",
    },
    skillCategories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "A short category label, e.g. 'Languages', 'Backend', 'Databases', 'Tools', 'Cloud', 'Practices'. Choose categories that fit the candidate's actual field (not necessarily software-only).",
          },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["category", "items"],
      },
      description:
        "The same skills as the flat 'skills' list, but grouped into 2-6 short labeled categories for display, mirroring how a real resume groups a technical-skills section. Every skill must be truthful and already present in skills.",
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          title: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          bullets: {
            type: "array",
            items: { type: "string" },
            description:
              "Rewritten achievement bullets. Start with strong action verbs, keep every fact truthful to the source resume, weave in job-description keywords only where genuinely applicable, and preserve/quantify metrics that were already present.",
          },
        },
        required: ["company", "title", "bullets"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          school: { type: "string" },
          degree: { type: "string" },
          field: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
        },
        required: ["school", "degree"],
      },
    },
    certifications: { type: "array", items: { type: "string" } },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          date: {
            type: "string",
            description: "Year or date range for the project, e.g. '2024' or 'July 2024 -- April 2025'.",
          },
          technologies: {
            type: "string",
            description: "Comma-separated tech stack used, e.g. 'React.js, Node.js, PostgreSQL, JWT'.",
          },
          description: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          level: {
            type: "string",
            description: "Proficiency as stated in the source resume, e.g. 'Native Proficiency', 'Professional Working Proficiency'.",
          },
        },
        required: ["name"],
      },
      description:
        "Only include languages explicitly listed in the candidate's original resume. Never invent a language or proficiency level.",
    },
    atsScore: {
      type: "integer",
      description:
        "Estimated 0-100 keyword/qualification match between the TAILORED resume and the job description.",
    },
    matchedKeywords: {
      type: "array",
      items: { type: "string" },
      description: "Important job-description keywords/skills present in the tailored resume.",
    },
    missingKeywords: {
      type: "array",
      items: { type: "string" },
      description:
        "Important job-description keywords/requirements NOT supported by the candidate's actual background. Never fabricate these into the resume.",
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description:
        "Honest, actionable suggestions for the candidate (e.g. skills to learn, certifications to pursue) to genuinely close remaining gaps, ordered with the highest-leverage gap first.",
    },
    quantificationPrompts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "Where this bullet lives, e.g. 'Acme Corp — Built data ingestion pipelines'.",
          },
          prompt: {
            type: "string",
            description:
              "A specific question asking the candidate for a real number to strengthen this bullet (e.g. 'How many records/day, or what % faster did this make the pipeline?'). Never invent the number yourself.",
          },
        },
        required: ["location", "prompt"],
      },
      description:
        "For bullets that lack a metric, ask the candidate for the real number instead of inventing one.",
    },
  },
  required: [
    "contact",
    "title",
    "summary",
    "skills",
    "experience",
    "education",
    "atsScore",
    "matchedKeywords",
    "missingKeywords",
    "recommendations",
  ],
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume writer and career coach.

Your job: given a candidate's existing resume and a target job description, produce a rewritten,
ATS-optimized version of the resume that maximizes the candidate's chances of passing automated
screening AND impressing a human reviewer.

Hard rules you must always follow:
1. NEVER invent employers, job titles, dates, degrees, or metrics that are not present in or
   reasonably implied by the source resume. Tailoring means re-emphasizing, re-wording, and
   re-prioritizing TRUE information — not fabricating experience.
2. Mirror the terminology of the job description wherever the candidate's real background
   genuinely supports it (e.g. if the JD says "cross-functional stakeholder management" and the
   resume shows relevant experience, use that phrasing). Do this aggressively and automatically —
   the candidate should not have to manually rewrite anything themselves. Reorder skills, and
   reorder bullets within each role, so the most JD-relevant TRUE achievements surface first.
3. Use simple, standard section structure and plain text formatting conventions (no tables,
   columns, or graphics) since this must remain machine-parseable by ATS software.
4. Start bullets with strong, varied action verbs. Preserve and highlight any quantified
   achievements already in the source resume; do not invent new numbers. If a bullet describes
   real, relevant work but has no metric, do NOT invent one — instead add an entry to
   "quantificationPrompts" asking the candidate for the real number.
5. If the job description requires something the candidate's resume does not support, list it
   honestly in "missingKeywords" and suggest how to address it in "recommendations", ordered
   with the single highest-leverage gap first — do not silently add it to the resume.
6. Keep the tone professional and factual.
7. Group skills into "skillCategories" the way a real resume does (e.g. Languages, Backend,
   Databases, Tools, Cloud, Practices — adapt labels to the candidate's actual field). Every
   item must also appear in the flat "skills" list. If the source resume lists languages spoken
   (e.g. Hindi, English) with a proficiency level, carry them into "languages" exactly as stated —
   never invent a language or a proficiency you don't see. For each project, carry over its real
   date/year and tech stack into "date" and "technologies" if the source resume states them.

Return only the JSON object matching the required schema.`;

export async function tailorResume({ resumeText, jobDescription }) {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error(
      "Server is missing GEMINI_API_KEY. Add it to backend/.env and restart the server."
    );
    err.status = 500;
    throw err;
  }

  const ai = getClient();
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  let response;
  try {
    response = await ai.models.generateContent({
      model,
      contents: `CANDIDATE'S CURRENT RESUME:\n"""\n${resumeText}\n"""\n\nTARGET JOB DESCRIPTION:\n"""\n${jobDescription}\n"""\n\nTailor the resume for this job.`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESUME_SCHEMA,
      },
    });
  } catch (err) {
    const wrapped = new Error(err.message || "Gemini request failed.");
    wrapped.status = err.status || 502;
    throw wrapped;
  }

  const text = response.text;
  if (!text) {
    const err = new Error("The AI did not return a structured resume. Please try again.");
    err.status = 502;
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error("The AI returned malformed JSON. Please try again.");
    err.status = 502;
    throw err;
  }
}
