// Generates a .tex file matching a classic single-column LaTeX resume
// template: centered header, dark-blue ruled section headings, a
// \resumeSubheading two-line entry format (bold+date, italic+location),
// bullet lists via itemize, and a compact technical-skills block.
// No tables/graphics — stays ATS-safe if someone compiles and re-parses it.

// Escape LaTeX special characters in a single pass so nothing gets
// double-escaped (e.g. a backslash's own escape sequence getting re-escaped
// by the brace rule that runs after it).
const LATEX_ESCAPES = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  "$": "\\$",
  "&": "\\&",
  "%": "\\%",
  "#": "\\#",
  "_": "\\_",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};
const ESCAPE_RE = /[\\{}$&%#_~^]/g;

function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(ESCAPE_RE, (ch) => LATEX_ESCAPES[ch]);
}

function href(url, label) {
  const clean = url.startsWith("http") || url.includes("@") ? url : `https://${url}`;
  const target = url.includes("@") && !url.startsWith("mailto:") ? `mailto:${url}` : clean;
  return `\\href{${target}}{${esc(label ?? url)}}`;
}

function contactLine(parts) {
  return parts
    .filter(Boolean)
    .map((p) => (p.isLink ? href(p.value, p.label) : esc(p.value)))
    .join(" \\quad $\\vert$ \\quad ");
}

function subheading(boldLeft, dateRight, italicLeft, italicRight) {
  return `\\resumeSubheading{${esc(boldLeft)}}{${esc(dateRight)}}{${esc(italicLeft)}}{${esc(
    italicRight
  )}}`;
}

function itemizeBlock(bullets) {
  if (!bullets?.length) return "";
  const items = bullets.map((b) => `    \\item ${esc(b)}`).join("\n");
  return `\\begin{itemize}\n${items}\n\\end{itemize}`;
}

export function generateLatex(resume) {
  const c = resume.contact || {};

  const row1 = contactLine(
    [
      c.phone ? { value: c.phone } : null,
      c.email ? { value: c.email, isLink: true } : null,
      c.linkedin ? { value: c.linkedin, isLink: true } : null,
    ].filter(Boolean)
  );
  const row2 = contactLine(
    [
      c.github ? { value: c.github, isLink: true } : null,
      c.location ? { value: c.location } : null,
      !c.github && c.website ? { value: c.website, isLink: true } : null,
    ].filter(Boolean)
  );

  const sections = [];

  if (resume.summary) {
    sections.push(`\\section*{Professional Summary}\n${esc(resume.summary)}`);
  }

  if (resume.education?.length) {
    const body = resume.education
      .map((ed, i) => {
        const s = subheading(
          ed.school,
          [ed.startDate, ed.endDate].filter(Boolean).join(" -- "),
          [ed.degree, ed.field ? `, ${ed.field}` : ""].join(""),
          ed.location
        );
        return i < resume.education.length - 1 ? `${s}\n\\vspace{2pt}` : s;
      })
      .join("\n");
    sections.push(`\\section*{Education}\n${body}`);
  }

  const skillCats = resume.skillCategories?.length
    ? resume.skillCategories
    : resume.skills?.length
    ? [{ category: "Skills", items: resume.skills }]
    : [];
  if (skillCats.length) {
    const items = skillCats
      .map((cat) => `    \\item \\textbf{${esc(cat.category)}:} ${esc(cat.items.join(", "))}`)
      .join("\n");
    sections.push(`\\section*{Technical Skills}\n\\begin{itemize}\n${items}\n\\end{itemize}`);
  }

  if (resume.experience?.length) {
    const body = resume.experience
      .map((job) => {
        const head = subheading(
          [job.title, job.company].filter(Boolean).join(" -- "),
          [job.startDate, job.endDate].filter(Boolean).join(" -- "),
          job.location,
          ""
        );
        return `${head}\n${itemizeBlock(job.bullets)}`;
      })
      .join("\n");
    sections.push(`\\section*{Professional Experience}\n${body}`);
  }

  if (resume.projects?.length) {
    const body = resume.projects
      .map((proj) => {
        const head = subheading(proj.name, proj.date, proj.technologies, "");
        const desc = proj.description ? `${esc(proj.description)}\\\\\n` : "";
        return `${head}\n${desc}${itemizeBlock(proj.bullets)}`;
      })
      .join("\n");
    sections.push(`\\section*{Projects}\n${body}`);
  }

  if (resume.certifications?.length) {
    sections.push(
      `\\section*{Certifications}\n${resume.certifications.map(esc).join(" \\quad|\\quad ")}`
    );
  }

  if (resume.languages?.length) {
    sections.push(
      `\\section*{Languages}\n${resume.languages
        .map((l) => `${esc(l.name)}${l.level ? `: ${esc(l.level)}` : ""}`)
        .join(" \\quad|\\quad ")}`
    );
  }

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.45in,top=0.35in,bottom=0.35in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\definecolor{darkblue}{RGB}{20,40,80}

\\hypersetup{colorlinks=true, urlcolor=darkblue, linkcolor=darkblue}

\\titleformat{\\section}{\\large\\bfseries\\color{darkblue}}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{5pt}{2pt}

\\setlist[itemize]{leftmargin=*, itemsep=0pt, topsep=1pt, parsep=0pt}
\\pagestyle{empty}
\\setlength{\\parskip}{0pt}
\\linespread{0.95}

\\newcommand{\\resumeSubheading}[4]{
  \\textbf{#1} \\hfill #2 \\\\
  \\textit{#3} \\hfill \\textit{#4} \\\\
}

\\begin{document}

\\begin{center}
    {\\LARGE \\bfseries ${esc(c.name || "Your Name")}} \\\\ \\vspace{3pt}
    ${resume.title ? `{\\color{darkblue}${esc(resume.title)}} \\\\ \\vspace{2pt}\n    ` : ""}${row1}${
    row1 && row2 ? " \\\\" : ""
  }
    ${row2}
\\end{center}

${sections.join("\n\n")}

\\end{document}
`;
}

export function downloadLatex(resume) {
  const tex = generateLatex(resume);
  const blob = new Blob([tex], { type: "text/x-tex" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const n = (resume.contact?.name || "resume").replace(/\s+/g, "_");
  a.href = url;
  a.download = `${n}_tailored_resume.tex`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
