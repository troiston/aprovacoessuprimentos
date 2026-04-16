export function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Validate your idea",
      description:
        "Pre-mortem analysis, market research, and kill criteria before writing a single line of code.",
    },
    {
      step: "2",
      title: "Define and design",
      description:
        "PRD, monetization strategy, technical spec, and design system — all validated before implementation.",
    },
    {
      step: "3",
      title: "Build with guardrails",
      description:
        "TDD, security checks, and automated quality gates ensure nothing slips through.",
    },
    {
      step: "4",
      title: "Ship confidently",
      description:
        "Release readiness review, deployment automation, and monitoring from day one.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="px-4 py-20 sm:px-6"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="how-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          How it works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/60">
          Four phases, zero guesswork.
        </p>
        <ol className="mt-16 list-none space-y-8 p-0">
          {steps.map((item, i) => (
            <li key={item.step} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-sm font-bold"
                  aria-hidden="true"
                >
                  {item.step}
                </div>
                {i < steps.length - 1 && (
                  <span
                    className="mt-2 h-full min-h-[2rem] w-px bg-foreground/20"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="pb-8">
                <h3 className="text-lg font-semibold">
                  <span className="sr-only">Step {item.step}. </span>
                  {item.title}
                </h3>
                <p className="mt-1 text-foreground/60">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
