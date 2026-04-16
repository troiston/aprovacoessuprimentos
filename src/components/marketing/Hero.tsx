import Link from "next/link";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 sm:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-foreground/60">
          Trusted by 500+ teams worldwide
        </p>
        <h1
          id="hero-heading"
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Ship products faster
          <span className="block text-foreground/40">without the chaos</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/60 sm:text-xl">
          The structured framework that turns ideas into production-ready SaaS
          applications. Stop guessing, start building with confidence.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
          >
            Start Building Free
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-8 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            See How It Works
          </a>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-5xl">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] shadow-2xl">
          <div
            className="flex h-full items-center justify-center text-foreground/20"
            role="img"
            aria-label="Product screenshot placeholder — to be added in design phase"
          >
            <p className="text-sm">Product screenshot — added during Phase 1D</p>
          </div>
        </div>
      </div>
    </section>
  );
}
