import { useState } from "react";
import Hero from "./components/Hero";
import StepNav from "./components/StepNav";
import ResumeStep from "./components/ResumeStep";
import JobDescStep from "./components/JobDescStep";
import ScanningLoader from "./components/ScanningLoader";
import ResultsView from "./components/ResultsView";
import { tailorResume } from "./lib/api";
import { AlertCircle } from "lucide-react";

const INITIAL = {
  view: "hero", // "hero" | "wizard"
  step: 1,
  resumeText: "",
  jobDescription: "",
  result: null,
  loading: false,
  error: "",
};

export default function App() {
  const [state, setState] = useState(INITIAL);
  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const handleGenerate = async () => {
    set({ step: 3, loading: true, error: "" });
    try {
      const result = await tailorResume(state.resumeText, state.jobDescription);
      set({ result, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  };

  const startOver = () => setState(INITIAL);

  return (
    <div className="min-h-screen bg-ink font-body">
      {state.view === "hero" && (
        <>
          <Hero onStart={() => set({ view: "wizard", step: 1 })} />
          <HowItWorks />
        </>
      )}

      {state.view === "wizard" && (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <div className="mb-12">
            <StepNav current={state.step} />
          </div>

          {state.step === 1 && (
            <ResumeStep
              value={state.resumeText}
              onChange={(resumeText) => set({ resumeText })}
              onNext={() => set({ step: 2 })}
            />
          )}

          {state.step === 2 && (
            <JobDescStep
              value={state.jobDescription}
              onChange={(jobDescription) => set({ jobDescription })}
              onBack={() => set({ step: 1 })}
              onGenerate={handleGenerate}
            />
          )}

          {state.step === 3 && state.loading && <ScanningLoader />}

          {state.step === 3 && !state.loading && state.error && (
            <div className="animate-fade-up text-center py-16">
              <AlertCircle className="mx-auto mb-4 text-amber-light" size={32} />
              <p className="text-paper mb-1">Couldn't generate your resume</p>
              <p className="text-ink-soft text-sm mb-8 max-w-md mx-auto">
                {state.error}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => set({ step: 2, error: "" })}
                  className="border border-line-dark hover:border-ink-soft text-ink-soft hover:text-paper px-5 py-2.5 rounded-md text-sm transition-colors"
                >
                  ← back
                </button>
                <button
                  onClick={handleGenerate}
                  className="bg-signal hover:bg-signal-light text-paper px-5 py-2.5 rounded-md text-sm transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {state.step === 3 && !state.loading && state.result && (
            <ResultsView result={state.result} onStartOver={startOver} />
          )}
        </div>
      )}
    </div>
  );
}

function HowItWorks() {
  const items = [
    {
      n: "01",
      title: "Bring your resume",
      body: "Paste it in or upload a PDF/DOCX. We read what's already true about your background.",
    },
    {
      n: "02",
      title: "Paste the job posting",
      body: "The exact language a hiring team — and their ATS — is scanning for.",
    },
    {
      n: "03",
      title: "Get a tailored rewrite",
      body: "Re-prioritized, re-worded, keyword-matched — and honest about what's still missing.",
    },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-10">
        How it works
      </p>
      <div className="grid sm:grid-cols-3 gap-10">
        {items.map((item) => (
          <div key={item.n} className="border-t border-line-dark pt-5">
            <span className="font-mono text-signal-light text-sm">{item.n}</span>
            <h3 className="font-display text-xl text-paper mt-3 mb-2">
              {item.title}
            </h3>
            <p className="text-ink-soft text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
