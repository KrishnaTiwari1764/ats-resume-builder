import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, Loader2, X } from "lucide-react";
import { parseResumeFile } from "../lib/api";

export default function ResumeStep({ value, onChange, onNext }) {
  const [mode, setMode] = useState("paste"); // "paste" | "upload"
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setError("");
      setParsing(true);
      setFileName(file.name);
      try {
        const text = await parseResumeFile(file);
        onChange(text);
      } catch (err) {
        setError(err.message);
        setFileName("");
      } finally {
        setParsing(false);
      }
    },
    [onChange]
  );

  const canContinue = value.trim().length >= 30;

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-3xl text-paper">
        Start with your resume as it is today.
      </h2>
      <p className="text-ink-soft mt-2 mb-8">
        Nothing gets invented later that isn't grounded in what's here — so
        the more complete this is, the better the result.
      </p>

      <div className="inline-flex rounded-md border border-line-dark p-1 mb-5 font-mono text-xs">
        {[
          { id: "paste", label: "Paste text" },
          { id: "upload", label: "Upload file" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`px-4 py-2 rounded transition-colors ${
              mode === t.id
                ? "bg-signal text-paper"
                : "text-ink-soft hover:text-paper"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === "paste" && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full text of your current resume — experience, skills, education, all of it."
          rows={14}
          className="w-full bg-[#161E22] border border-line-dark rounded-lg p-5 text-paper placeholder:text-ink-soft/60 font-body text-sm leading-relaxed focus:border-signal-light transition-colors resize-y"
        />
      )}

      {mode === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            dragOver
              ? "border-signal-light bg-signal/10"
              : "border-line-dark hover:border-ink-soft"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {parsing ? (
            <>
              <Loader2 className="mx-auto mb-3 text-signal-light animate-spin" size={28} />
              <p className="text-ink-soft text-sm">Reading {fileName}…</p>
            </>
          ) : fileName && value ? (
            <>
              <FileText className="mx-auto mb-3 text-signal-light" size={28} />
              <p className="text-paper text-sm font-medium">{fileName}</p>
              <p className="text-ink-soft text-xs mt-1">
                {value.length.toLocaleString()} characters extracted — click to replace
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFileName("");
                  onChange("");
                }}
                className="mt-4 inline-flex items-center gap-1 text-xs text-ink-soft hover:text-amber-light font-mono"
              >
                <X size={12} /> remove
              </button>
            </>
          ) : (
            <>
              <UploadCloud className="mx-auto mb-3 text-ink-soft" size={28} />
              <p className="text-paper text-sm">
                Drop a PDF, DOCX, or TXT resume here, or click to browse
              </p>
              <p className="text-ink-soft text-xs mt-1">Max 8MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-amber font-mono">{error}</p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <span className="text-ink-soft text-xs font-mono">
          {value.trim().length > 0
            ? `${value.trim().length.toLocaleString()} characters`
            : "waiting for content"}
        </span>
        <button
          disabled={!canContinue}
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-signal disabled:bg-line-dark disabled:text-ink-soft disabled:cursor-not-allowed hover:bg-signal-light text-paper font-medium px-6 py-3 rounded-md transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
