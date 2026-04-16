const testimonials = [
  {
    quote:
      "Shipped our MVP in 3 weeks instead of 3 months. The phase-gated approach eliminated 90% of our rework.",
    author: "Sarah Chen",
    role: "CTO, TechFlow",
  },
  {
    quote:
      "Security audit passed first try. Having threat modeling built into the process saved us $50K in remediation.",
    author: "Marcus Rivera",
    role: "Head of Engineering, SecureOps",
  },
  {
    quote:
      "Our design-to-code fidelity went from 60% to 95%. The structured handoff between phases is a game changer.",
    author: "Aiko Tanaka",
    role: "Lead Designer, PixelCraft",
  },
];

export function Testimonials() {
  return (
    <section
      className="bg-foreground/[0.02] px-4 py-20 sm:px-6"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="testimonials-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Teams ship better with VibeCoding
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="rounded-xl border border-foreground/10 p-6"
            >
              <blockquote>
                <p className="text-sm leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-4 border-t border-foreground/5 pt-4">
                <p className="text-sm font-semibold">{t.author}</p>
                <p className="text-xs text-foreground/50">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
