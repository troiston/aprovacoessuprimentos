export function LogoBar() {
  const logos = [
    "Company A",
    "Company B",
    "Company C",
    "Company D",
    "Company E",
  ];

  return (
    <section
      className="border-y border-foreground/5 bg-foreground/[0.02] py-10"
      aria-labelledby="logo-bar-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p
          id="logo-bar-heading"
          className="text-center text-xs font-medium uppercase tracking-widest text-foreground/40"
        >
          Trusted by innovative teams
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((name) => (
            <li
              key={name}
              className="text-sm font-semibold text-foreground/20"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
