---
id: skill-build-faq
title: "Build FAQ"
agent: 03-builder
version: 1.0
category: components
priority: important
requires:
  - skill: skill-build-cta
  - rule: 02-code-style
provides:
  - accordion FAQ acessível com JSON-LD FAQPage auto-gerado
used_by:
  - agent: 03-builder
  - agent: 04-seo-specialist
  - command: /new-page
---

# Build FAQ — Accordion com SEO Automático

## Por que Importa

FAQ com schema **FAQPage** JSON-LD gera **+20-30% CTR** nos resultados do Google (rich snippets com perguntas expandíveis). Accordion com animação de altura suave reduz scroll e mantém o usuário engajado.

## Regras

1. **AnimatePresence** para animar entrada/saída com height transition
2. **JSON-LD FAQPage** gerado automaticamente a partir dos dados
3. **Keyboard nav**: Enter/Space para toggle, Tab para navegar
4. **aria-expanded** + **aria-controls** + **role="region"**
5. **Uma pergunta aberta por vez** (accordion exclusivo) ou múltiplas (configável)

## Tipos

```tsx
// lib/types/faq.ts
export interface FAQItem {
  question: string;
  answer: string;
}
```

## Componente JSON-LD (Server Component)

```tsx
// components/faq/faq-schema.tsx
import type { FAQItem } from "@/lib/types/faq";

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Accordion Item

```tsx
// components/faq/faq-accordion.tsx
"use client";

import { useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/lib/types/faq";

interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
}

export function FAQAccordion({ items, allowMultiple = false }: FAQAccordionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const baseId = useId();

  const toggle = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    },
    [allowMultiple],
  );

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {items.map((item, i) => {
        const isOpen = openIndices.has(i);
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;

        return (
          <div key={triggerId}>
            <h3>
              <button
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(i);
                  }
                }}
                className={[
                  "flex w-full items-center justify-between gap-4 px-6 py-5",
                  "text-left text-base font-semibold text-foreground",
                  "transition-colors hover:bg-muted/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                ].join(" ")}
              >
                <span>{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

## Seção FAQ Completa

```tsx
// components/faq/faq-section.tsx
import { FAQAccordion } from "@/components/faq/faq-accordion";
import { FAQSchema } from "@/components/faq/faq-schema";
import type { FAQItem } from "@/lib/types/faq";

const FAQ_DATA: FAQItem[] = [
  {
    question: "Posso testar grátis antes de assinar?",
    answer:
      "Sim! Oferecemos 14 dias de teste gratuito em todos os planos, sem necessidade de cartão de crédito. Ao final do período, você escolhe se deseja continuar.",
  },
  {
    question: "Como funciona o suporte?",
    answer:
      "No plano Starter, suporte por e-mail com resposta em até 24h. No Pro, suporte prioritário com resposta em até 4h. No Enterprise, suporte 24/7 com gerente de conta dedicado.",
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer:
      "Sim, você pode fazer upgrade ou downgrade a qualquer momento. O valor é calculado proporcionalmente ao período restante.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Usamos criptografia AES-256 em repouso e TLS 1.3 em trânsito. Nossos servidores são certificados SOC 2 Type II e estamos em conformidade com a LGPD.",
  },
  {
    question: "Vocês oferecem desconto para ONGs?",
    answer:
      "Sim! Organizações sem fins lucrativos recebem 50% de desconto em qualquer plano. Entre em contato com nosso time comercial para ativar.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20">
      <FAQSchema items={FAQ_DATA} />
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-3 text-center text-3xl font-bold">
          Perguntas frequentes
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Não encontrou sua resposta? <a href="/contact" className="text-primary underline">Fale conosco</a>.
        </p>
        <FAQAccordion items={FAQ_DATA} />
      </div>
    </section>
  );
}
```

## Checklist

- [ ] JSON-LD FAQPage gerado automaticamente dos dados
- [ ] AnimatePresence com height transition suave
- [ ] `aria-expanded`, `aria-controls`, `role="region"`
- [ ] Navegação por teclado (Enter/Space/Tab)
- [ ] Link para contato para perguntas não respondidas
- [ ] Máximo 5-8 perguntas (se mais, agrupar por categoria)
