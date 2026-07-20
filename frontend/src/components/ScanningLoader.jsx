const MESSAGES = [
  "Reading the job description",
  "Identifying key requirements",
  "Matching against your experience",
  "Rewriting for ATS parsing",
  "Scoring the match",
];

export default function ScanningLoader() {
  return (
    <div className="animate-fade-up flex flex-col items-center text-center py-16">
      <div className="relative w-64 h-40 rounded-lg border border-line-dark bg-[#161E22] overflow-hidden mb-8">
        <div className="p-5 space-y-2.5">
          {[80, 60, 90, 45, 70, 55].map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-line-dark"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 -inset-y-2 overflow-hidden">
          <div className="absolute inset-x-0 h-14 bg-gradient-to-b from-transparent via-signal-light/30 to-transparent animate-sweep" />
        </div>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal-light mb-2">
        Tailoring in progress
      </p>
      <ul className="text-ink-soft text-sm space-y-1.5">
        {MESSAGES.map((m, i) => (
          <li
            key={m}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 0.6}s`, animationFillMode: "backwards" }}
          >
            {m}…
          </li>
        ))}
      </ul>
    </div>
  );
}
