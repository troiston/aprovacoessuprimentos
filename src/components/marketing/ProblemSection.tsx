export function ProblemSection() {
  const problems = [
    {
      title: "Endless planning, zero shipping",
      description:
        "You spend weeks in docs and meetings but nothing reaches production.",
    },
    {
      title: "Security as an afterthought",
      description:
        "Vulnerabilities discovered post-launch cost 6x more to fix than at design time.",
    },
    {
      title: "Design-dev disconnect",
      description:
        "Designs that look great in Figma but fall apart in implementation.",
    },
  ];

  return (
    <section
      className="px-4 py-20 sm:px-6"
      aria-labelledby="problem-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="problem-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Sound familiar?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/60">
          Most teams struggle with the same challenges when building SaaS products.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.title}
              className="rounded-xl border border-foreground/10 p-6"
            >
              <h3 className="font-semibold">{problem.title}</h3>
              <p className="mt-2 text-sm text-foreground/60">
                {problem.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
