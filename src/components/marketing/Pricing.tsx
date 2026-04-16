import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "For individuals exploring the framework",
    features: [
      "1 project",
      "Community support",
      "Basic templates",
      "Core documentation",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For teams building production SaaS",
    features: [
      "Unlimited projects",
      "Priority support",
      "All templates & skills",
      "CI/CD automation",
      "Security audits",
      "Custom design system",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "SOC2 compliance pack",
      "Team onboarding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="px-4 py-20 sm:px-6"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="pricing-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-foreground/60">
          Start free. Scale when you are ready. No surprises.
        </p>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-foreground bg-foreground/[0.03] shadow-lg ring-1 ring-foreground/10"
                  : "border-foreground/10"
              }`}
            >
              {tier.highlighted && (
                <p className="mb-4">
                  <span className="inline-block rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                    Most Popular
                  </span>
                </p>
              )}
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <p className="mt-1 text-sm text-foreground/60">
                {tier.description}
              </p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                {tier.period ? (
                  <span className="text-foreground/60">{tier.period}</span>
                ) : null}
              </div>
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-foreground/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                  tier.highlighted
                    ? "bg-foreground text-background"
                    : "border border-foreground/20 text-foreground hover:bg-foreground/5"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
