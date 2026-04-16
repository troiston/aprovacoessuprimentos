export function Features() {
  const features = [
    {
      title: "Phase-gated development",
      description:
        "Every step validated before the next begins. No skipping, no chaos.",
      icon: "01",
    },
    {
      title: "Security by design",
      description:
        "OWASP compliance, threat modeling, and audit trails baked into every phase.",
      icon: "02",
    },
    {
      title: "AI-assisted workflows",
      description:
        "Cursor agents with 87+ skills automate repetitive work so you focus on decisions.",
      icon: "03",
    },
    {
      title: "Production-ready from day one",
      description:
        "CI/CD, monitoring, runbooks, and deployment docs generated alongside your code.",
      icon: "04",
    },
  ];

  return (
    <section
      id="features"
      className="bg-foreground/[0.02] px-4 py-20 sm:px-6"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="features-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Everything you need to ship with confidence
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/60">
          A structured framework that covers every stage from idea to production.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background"
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-foreground/60">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
