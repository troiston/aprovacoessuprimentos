---
id: skill-build-comparison-table
title: "Build Comparison Table"
agent: 03-builder
version: 1.0
category: components
priority: standard
requires:
  - skill: skill-build-cta
  - rule: 02-code-style
provides:
  - tabela comparativa "vs concorrentes" responsiva com sticky header
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Comparison Table — "Nós vs Concorrentes"

## Por que Importa

Tabelas comparativas eliminam dúvidas na hora da decisão. O visitante que compara ativamente já está no fundo do funil. Coluna própria destacada + sticky header + check/X visuais = decisão rápida a seu favor. No mobile, scroll horizontal com **primeira coluna fixa** é obrigatório.

## Regras de Design

1. **Sua coluna sempre destacada** — fundo sutil + badge no header
2. **Sticky header** — sempre visível ao scrollar verticalmente
3. **Check/X visuais** — verde/vermelho, não texto
4. **Mobile**: scroll horizontal, primeira coluna fixa com sombra de overflow
5. **CTA no final** da sua coluna

## Tipos

```tsx
// lib/types/comparison.ts
export interface ComparisonRow {
  feature: string;
  category?: string;
  values: Record<string, boolean | string>;
}

export interface Competitor {
  id: string;
  name: string;
  isOwn?: boolean;
}
```

## Componente

```tsx
// components/comparison/comparison-table.tsx
"use client";

import { Check, X, Minus } from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";
import type { ComparisonRow, Competitor } from "@/lib/types/comparison";

interface ComparisonTableProps {
  competitors: Competitor[];
  rows: ComparisonRow[];
  ctaText?: string;
  ctaHref?: string;
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-green-500" aria-label="Sim" />
    ) : (
      <X className="mx-auto h-5 w-5 text-red-400/60" aria-label="Não" />
    );
  }
  if (value === "-") {
    return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="N/A" />;
  }
  return <span className="font-medium text-foreground">{value}</span>;
}

export function ComparisonTable({
  competitors,
  rows,
  ctaText = "Começar agora",
  ctaHref = "/signup",
}: ComparisonTableProps) {
  const ownCompetitor = competitors.find((c) => c.isOwn);
  const categories = [...new Set(rows.map((r) => r.category).filter(Boolean))];

  function renderRows(filtered: ComparisonRow[]) {
    return filtered.map((row, i) => (
      <tr
        key={row.feature}
        className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
      >
        <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm font-medium text-foreground shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
          {row.feature}
        </td>
        {competitors.map((comp) => (
          <td
            key={comp.id}
            className={[
              "px-4 py-3 text-center text-sm",
              comp.isOwn ? "bg-primary/[0.03]" : "",
            ].join(" ")}
          >
            <CellValue value={row.values[comp.id] ?? "-"} />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className="relative overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="sticky top-0 z-20">
          <tr className="border-b border-border bg-muted/80 backdrop-blur-sm">
            <th className="sticky left-0 z-30 bg-muted/80 px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">
              Recurso
            </th>
            {competitors.map((comp) => (
              <th
                key={comp.id}
                className={[
                  "px-4 py-4 text-center",
                  comp.isOwn
                    ? "bg-primary/10 text-primary font-bold text-base"
                    : "text-xs font-medium uppercase tracking-wider text-muted-foreground",
                ].join(" ")}
              >
                {comp.isOwn && (
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary/70">
                    Recomendado
                  </span>
                )}
                {comp.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.length > 0
            ? categories.map((cat) => (
                <>
                  <tr key={`cat-${cat}`}>
                    <td
                      colSpan={competitors.length + 1}
                      className="sticky left-0 bg-muted/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      {cat}
                    </td>
                  </tr>
                  {renderRows(rows.filter((r) => r.category === cat))}
                </>
              ))
            : renderRows(rows)}
        </tbody>
        {ownCompetitor && (
          <tfoot>
            <tr className="border-t border-border">
              <td className="sticky left-0 bg-background px-4 py-4" />
              {competitors.map((comp) => (
                <td key={comp.id} className="px-4 py-4 text-center">
                  {comp.isOwn && (
                    <CTAButton
                      size="sm"
                      onClick={() => (window.location.href = ctaHref)}
                    >
                      {ctaText}
                    </CTAButton>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
```

## Exemplo de Uso

```tsx
import { ComparisonTable } from "@/components/comparison/comparison-table";

const competitors = [
  { id: "us", name: "NossaPlatforma", isOwn: true },
  { id: "comp-a", name: "Concorrente A" },
  { id: "comp-b", name: "Concorrente B" },
  { id: "comp-c", name: "Concorrente C" },
];

const rows = [
  {
    feature: "Automação com IA",
    category: "Funcionalidades",
    values: { us: true, "comp-a": false, "comp-b": true, "comp-c": false },
  },
  {
    feature: "API aberta",
    category: "Funcionalidades",
    values: { us: true, "comp-a": true, "comp-b": false, "comp-c": true },
  },
  {
    feature: "Integrações nativas",
    category: "Funcionalidades",
    values: { us: "100+", "comp-a": "30+", "comp-b": "50+", "comp-c": "20+" },
  },
  {
    feature: "SSO / SAML",
    category: "Segurança",
    values: { us: true, "comp-a": false, "comp-b": false, "comp-c": true },
  },
  {
    feature: "LGPD compliant",
    category: "Segurança",
    values: { us: true, "comp-a": true, "comp-b": false, "comp-c": false },
  },
  {
    feature: "SLA garantido",
    category: "Suporte",
    values: { us: "99.99%", "comp-a": "99.9%", "comp-b": "99.5%", "comp-c": "-" },
  },
  {
    feature: "Suporte em português",
    category: "Suporte",
    values: { us: true, "comp-a": false, "comp-b": true, "comp-c": false },
  },
  {
    feature: "Preço mensal (Pro)",
    category: "Preço",
    values: { us: "R$ 97", "comp-a": "R$ 149", "comp-b": "R$ 129", "comp-c": "R$ 199" },
  },
];

<ComparisonTable
  competitors={competitors}
  rows={rows}
  ctaText="Testar grátis por 14 dias"
  ctaHref="/signup"
/>
```

## Checklist

- [ ] Coluna própria com destaque visual (fundo, badge "Recomendado")
- [ ] Sticky header para scroll vertical
- [ ] Primeira coluna sticky para scroll horizontal (mobile)
- [ ] Sombra de overflow na coluna fixa
- [ ] Check verde / X vermelho para booleanos
- [ ] Agrupamento por categorias quando > 6 rows
- [ ] CTA no footer da coluna própria
- [ ] `min-w` suficiente + `overflow-x-auto` no container
