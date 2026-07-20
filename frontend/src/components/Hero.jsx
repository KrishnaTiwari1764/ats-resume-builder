import ScanDocument from "./ScanDocument";

export default function Hero({ onStart }) {
  return (
    <header className="relative overflow-hidden border-b border-line-dark">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-signal-light border border-signal/40 rounded-full px-3 py-1 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-light animate-pulse" />
            Resume ↔ job description matching
          </div>

          <h1 className="font-display text-[2.6rem] leading-[1.08] sm:text-5xl md:text-[3.4rem] text-paper tracking-tight">
            Every job posting speaks its own dialect.
            <span className="block text-signal-light italic">
              Make your resume fluent in it.
            </span>
          </h1>

          <p className="mt-6 text-ink-soft text-lg leading-relaxed max-w-md font-body">
            Paste a job description. Signal rewrites your resume around it —
            same true experience, re-prioritized language, the keywords an
            ATS is actually scanning for.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 bg-signal hover:bg-signal-light text-paper font-medium px-6 py-3.5 rounded-md transition-colors"
            >
              Tailor my resume
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
            <span className="text-ink-soft text-sm font-mono">
              no signup · nothing stored on a server
            </span>
          </div>
        </div>

        <ScanDocument className="hidden md:block" />
      </div>
    </header>
  );
}
