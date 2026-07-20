export default function ScoreGauge({ score = 0 }) {
  const size = 132;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);

  const color =
    score >= 80 ? "#4C9382" : score >= 55 ? "#C97A2B" : "#C9622B";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2A3438"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl text-paper leading-none">
          {score}
        </span>
        <span className="font-mono text-[10px] text-ink-soft uppercase tracking-wide mt-1">
          match
        </span>
      </div>
    </div>
  );
}
