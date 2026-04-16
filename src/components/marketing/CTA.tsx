import Link from "next/link";

export function CTA() {
  return (
    <section className="px-4 py-20 sm:px-6" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-4xl rounded-2xl bg-foreground p-12 text-center text-background">
        <h2
          id="cta-heading"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Ready to build something great?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-background/70">
          Join 500+ teams shipping production SaaS faster with structured,
          secure, AI-assisted development.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-full bg-background px-8 text-sm font-semibold text-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
          >
            Get Started Free
          </Link>
          <p className="text-xs text-background/50">
            No credit card required. Free tier forever.
          </p>
        </div>
      </div>
    </section>
  );
}
