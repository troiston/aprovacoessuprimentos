"use client";

import { useId, useState } from "react";

const faqs = [
  {
    question: "What is VibeCoding?",
    answer:
      "VibeCoding is a structured development framework that guides you from idea validation to production deployment using documented phases, quality gates, and AI-assisted workflows.",
  },
  {
    question: "Do I need Cursor IDE to use this?",
    answer:
      "The framework is optimized for Cursor with 87+ agent skills, but the documentation-driven methodology works with any IDE or workflow.",
  },
  {
    question: "Can I use this for an existing project?",
    answer:
      "Yes. You can adopt individual phases (like the security audit or design system) without starting from scratch. The framework is modular by design.",
  },
  {
    question: "What happens after my free trial?",
    answer:
      "Your projects and data remain accessible. You can continue on the free tier with limited features or upgrade to Pro for the full experience.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Security is built into every phase. We use OWASP-compliant practices, encrypted data at rest and in transit, and regular security audits.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="px-4 py-20 sm:px-6" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <h2
          id="faq-heading"
          className="text-center text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-12 divide-y divide-foreground/10">
          {faqs.map((faq, i) => {
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            const expanded = openIndex === i;

            return (
              <div key={faq.question} className="py-5">
                <h3 className="text-base font-medium">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(expanded ? null : i)}
                    className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                  >
                    <span className="text-sm font-medium">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-foreground/40 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!expanded}
                  className="mt-3"
                >
                  <p className="text-sm text-foreground/60">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
