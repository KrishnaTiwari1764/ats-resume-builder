export default function JobDescStep({ value, onChange, onBack, onGenerate }) {
  const canContinue = value.trim().length >= 30;

  return (
    <div className="animate-fade-up">
      <h2 className="font-display text-3xl text-paper">
        Now, the job you're aiming at.
      </h2>
      <p className="text-ink-soft mt-2 mb-8">
        Paste the full posting — title, responsibilities, requirements. The
        more specific it is, the more precisely we can match it.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here…"
        rows={14}
        autoFocus
        className="w-full bg-[#161E22] border border-line-dark rounded-lg p-5 text-paper placeholder:text-ink-soft/60 font-body text-sm leading-relaxed focus:border-signal-light transition-colors resize-y"
      />

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-ink-soft hover:text-paper text-sm font-mono transition-colors"
        >
          ← back
        </button>
        <button
          disabled={!canContinue}
          onClick={onGenerate}
          className="inline-flex items-center gap-2 bg-signal disabled:bg-line-dark disabled:text-ink-soft disabled:cursor-not-allowed hover:bg-signal-light text-paper font-medium px-6 py-3 rounded-md transition-colors"
        >
          Tailor my resume →
        </button>
      </div>
    </div>
  );
}
