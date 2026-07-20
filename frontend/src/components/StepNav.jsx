const STEPS = [
  { n: "01", label: "Your resume" },
  { n: "02", label: "Job description" },
  { n: "03", label: "Tailored match" },
];

export default function StepNav({ current }) {
  return (
    <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs sm:text-sm">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <div key={step.n} className="flex items-center gap-3 sm:gap-6">
            <div
              className={`flex items-center gap-2 transition-colors ${
                active
                  ? "text-signal-light"
                  : done
                  ? "text-ink-soft"
                  : "text-ink-soft/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                  active
                    ? "border-signal-light bg-signal/15"
                    : done
                    ? "border-ink-soft/60"
                    : "border-ink-soft/25"
                }`}
              >
                {done ? "✓" : step.n}
              </span>
              <span className="hidden sm:inline uppercase tracking-wide">
                {step.label}
              </span>
            </div>
            {stepNum < STEPS.length && (
              <span className="w-6 sm:w-10 h-px bg-line-dark" />
            )}
          </div>
        );
      })}
    </div>
  );
}
