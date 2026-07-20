const LINES = [
  { w: "78%" },
  { w: "92%" },
  { w: "65%" },
  { w: "88%" },
  { w: "52%" },
  { w: "84%" },
  { w: "70%" },
  { w: "90%" },
  { w: "60%" },
];

const TAGS = [
  { label: "React", top: "18%" },
  { label: "TypeScript", top: "42%" },
  { label: "CI/CD", top: "66%" },
];

export default function ScanDocument({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full max-w-sm mx-auto rounded-lg border border-line-dark bg-[#161E22] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* header strip */}
        <div className="px-6 pt-6 pb-4 border-b border-line-dark/70">
          <div className="h-3 w-2/5 rounded-full bg-paper/70 mb-2" />
          <div className="h-2 w-1/3 rounded-full bg-ink-soft/60" />
        </div>

        {/* body lines */}
        <div className="px-6 py-6 space-y-3 relative">
          {LINES.map((line, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-line-dark relative overflow-hidden"
              style={{ width: line.w }}
            >
              <span
                className="absolute inset-0 bg-signal-light/90 rounded-full origin-left animate-[fill_2.4s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            </div>
          ))}

          {/* scan beam */}
          <div className="pointer-events-none absolute inset-x-0 -inset-y-2 overflow-hidden">
            <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-signal-light/25 to-transparent animate-sweep" />
          </div>
        </div>

        {/* floating keyword tags */}
        {TAGS.map((tag) => (
          <div
            key={tag.label}
            className="absolute right-[-1px] translate-x-full sm:translate-x-1/2 flex items-center gap-1.5 bg-signal text-paper text-[11px] font-mono px-2.5 py-1 rounded-md shadow-lg animate-fade-up"
            style={{ top: tag.top, animationDelay: "1.2s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-paper" />
            {tag.label}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fill {
          0%, 15% { transform: scaleX(0); }
          40%, 100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
