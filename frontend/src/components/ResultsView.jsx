import { useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, RotateCcw, Check, AlertTriangle, FileCode } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import ResumeDocument from "./ResumeDocument";
import { downloadLatex } from "../lib/latex";

export default function ResultsView({ result, onStartOver }) {
  const [resume, setResume] = useState(result);

  const fileName = useMemo(() => {
    const n = (resume.contact?.name || "resume").replace(/\s+/g, "_");
    return `${n}_tailored_resume.pdf`;
  }, [resume.contact?.name]);

  const updateBullet = (expIdx, bulletIdx, value) => {
    setResume((r) => {
      const experience = [...r.experience];
      const bullets = [...experience[expIdx].bullets];
      bullets[bulletIdx] = value;
      experience[expIdx] = { ...experience[expIdx], bullets };
      return { ...r, experience };
    });
  };

  const updateProjectBullet = (projIdx, bulletIdx, value) => {
    setResume((r) => {
      const projects = [...r.projects];
      const bullets = [...projects[projIdx].bullets];
      bullets[bulletIdx] = value;
      projects[projIdx] = { ...projects[projIdx], bullets };
      return { ...r, projects };
    });
  };

  return (
    <div className="animate-fade-up pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12 mb-10">
        <ScoreGauge score={resume.atsScore ?? 0} />
        <div className="flex-1">
          <h2 className="font-display text-3xl text-paper mb-2">
            Here's your tailored match.
          </h2>
          <p className="text-ink-soft text-sm leading-relaxed max-w-lg">
            Fully auto-tailored to this job in one pass — rewritten,
            reordered, and keyword-matched to the posting. 100% accurate:
            every word here is true to your real background, so it'll hold
            up in the interview too. Still editable if you want to tweak
            anything.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-col gap-3">
          <PDFDownloadLink
            document={<ResumeDocument resume={resume} />}
            fileName={fileName}
            className="inline-flex items-center justify-center gap-2 bg-signal hover:bg-signal-light text-paper font-medium px-5 py-3 rounded-md transition-colors text-sm whitespace-nowrap"
          >
            {({ loading }) => (
              <>
                <Download size={16} />
                {loading ? "Preparing…" : "Download PDF"}
              </>
            )}
          </PDFDownloadLink>
          <button
            onClick={() => downloadLatex(resume)}
            className="inline-flex items-center justify-center gap-2 border border-line-dark hover:border-ink-soft text-ink-soft hover:text-paper px-5 py-3 rounded-md transition-colors text-sm whitespace-nowrap"
          >
            <FileCode size={14} />
            Download .tex
          </button>
          <button
            onClick={onStartOver}
            className="inline-flex items-center justify-center gap-2 border border-line-dark hover:border-ink-soft text-ink-soft hover:text-paper px-5 py-3 rounded-md transition-colors text-sm whitespace-nowrap"
          >
            <RotateCcw size={14} />
            Start over
          </button>
        </div>
      </div>

      {/* Keyword analysis */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="border border-line-dark rounded-lg p-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-signal-light mb-3">
            <Check size={14} /> Matched keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {resume.matchedKeywords?.length ? (
              resume.matchedKeywords.map((k) => (
                <span
                  key={k}
                  className="text-xs font-mono bg-signal/15 text-signal-light border border-signal/30 rounded px-2 py-1"
                >
                  {k}
                </span>
              ))
            ) : (
              <span className="text-ink-soft text-sm">None found</span>
            )}
          </div>
        </div>
        <div className="border border-line-dark rounded-lg p-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-amber-light mb-3">
            <AlertTriangle size={14} /> Gaps to address
          </p>
          <div className="flex flex-wrap gap-2">
            {resume.missingKeywords?.length ? (
              resume.missingKeywords.map((k) => (
                <span
                  key={k}
                  className="text-xs font-mono bg-amber/10 text-amber-light border border-amber/30 rounded px-2 py-1"
                >
                  {k}
                </span>
              ))
            ) : (
              <span className="text-ink-soft text-sm">None — strong match</span>
            )}
          </div>
        </div>
      </div>

      {/* Resume preview, styled like an actual document */}
      <div className="bg-paper text-ink rounded-lg shadow-2xl p-8 sm:p-10 mb-10">
        <input
          value={resume.contact?.name || ""}
          onChange={(e) =>
            setResume((r) => ({ ...r, contact: { ...r.contact, name: e.target.value } }))
          }
          className="font-display text-3xl w-full bg-transparent focus:bg-paper-dim rounded px-1 -mx-1 outline-none"
        />
        <input
          value={resume.title || ""}
          onChange={(e) => setResume((r) => ({ ...r, title: e.target.value }))}
          className="text-signal font-medium w-full bg-transparent focus:bg-paper-dim rounded px-1 -mx-1 outline-none mt-1"
        />
        <p className="text-ink-soft text-xs font-mono mt-2">
          {[
            resume.contact?.email,
            resume.contact?.phone,
            resume.contact?.location,
            resume.contact?.linkedin,
          ]
            .filter(Boolean)
            .join("   ·   ")}
        </p>

        <SectionLabel>Summary</SectionLabel>
        <textarea
          value={resume.summary || ""}
          onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))}
          rows={4}
          className="w-full bg-transparent focus:bg-paper-dim rounded px-1 -mx-1 outline-none text-sm leading-relaxed resize-y"
        />

        <SectionLabel>Skills</SectionLabel>
        <input
          value={(resume.skills || []).join(", ")}
          onChange={(e) =>
            setResume((r) => ({
              ...r,
              skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            }))
          }
          className="w-full bg-transparent focus:bg-paper-dim rounded px-1 -mx-1 outline-none text-sm"
        />

        <SectionLabel>Experience</SectionLabel>
        <div className="space-y-6">
          {resume.experience?.map((job, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline flex-wrap gap-x-3">
                <span className="font-semibold text-sm">{job.title}</span>
                <span className="text-xs text-ink-soft font-mono">
                  {[job.startDate, job.endDate].filter(Boolean).join(" – ")}
                </span>
              </div>
              <div className="text-signal text-sm mb-2">
                {job.company}
                {job.location ? ` · ${job.location}` : ""}
              </div>
              <ul className="space-y-1.5">
                {job.bullets?.map((b, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-ink-soft mt-0.5">•</span>
                    <textarea
                      value={b}
                      onChange={(e) => updateBullet(i, j, e.target.value)}
                      rows={Math.max(1, Math.ceil(b.length / 90))}
                      className="flex-1 bg-transparent focus:bg-paper-dim rounded px-1 -mx-1 outline-none resize-y"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {resume.education?.length > 0 && (
          <>
            <SectionLabel>Education</SectionLabel>
            <div className="space-y-1.5">
              {resume.education.map((ed, i) => (
                <div key={i} className="flex justify-between text-sm flex-wrap gap-x-3">
                  <span>
                    {ed.degree}
                    {ed.field ? `, ${ed.field}` : ""} — {ed.school}
                  </span>
                  <span className="text-ink-soft font-mono text-xs">
                    {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {resume.projects?.length > 0 && (
          <>
            <SectionLabel>Projects</SectionLabel>
            <div className="space-y-6">
              {resume.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline flex-wrap gap-x-3">
                    <span className="font-semibold text-sm">{proj.name}</span>
                    <span className="text-xs text-ink-soft font-mono">{proj.date}</span>
                  </div>
                  {proj.technologies && (
                    <div className="text-signal text-xs italic mb-2">{proj.technologies}</div>
                  )}
                  <ul className="space-y-1.5">
                    {proj.bullets?.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm leading-relaxed">
                        <span className="text-ink-soft mt-0.5">•</span>
                        <textarea
                          value={b}
                          onChange={(e) => updateProjectBullet(i, j, e.target.value)}
                          rows={Math.max(1, Math.ceil(b.length / 90))}
                          className="flex-1 bg-transparent focus:bg-paper-dim rounded px-1 -mx-1 outline-none resize-y"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {resume.certifications?.length > 0 && (
          <>
            <SectionLabel>Certifications</SectionLabel>
            <p className="text-sm">{resume.certifications.join("  ·  ")}</p>
          </>
        )}

        {resume.languages?.length > 0 && (
          <>
            <SectionLabel>Languages</SectionLabel>
            <p className="text-sm">
              {resume.languages
                .map((l) => `${l.name}${l.level ? `: ${l.level}` : ""}`)
                .join("   |   ")}
            </p>
          </>
        )}
      </div>

      {resume.quantificationPrompts?.length > 0 && (
        <div className="border border-line-dark rounded-lg p-6 mb-6">
          <p className="font-mono text-xs uppercase tracking-wide text-amber-light mb-3">
            Strengthen these with a real number
          </p>
          <ul className="space-y-3">
            {resume.quantificationPrompts.map((q, i) => (
              <li key={i} className="text-sm">
                <span className="text-ink-soft font-mono text-xs block mb-0.5">
                  {q.location}
                </span>
                <span className="text-paper/90">{q.prompt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resume.recommendations?.length > 0 && (
        <div className="border border-line-dark rounded-lg p-6">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
            Worth doing before you apply
          </p>
          <ul className="space-y-2">
            {resume.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-paper/90 flex gap-2">
                <span className="text-signal-light">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft border-b border-line pb-1.5 mb-2.5 mt-6">
      {children}
    </p>
  );
}
