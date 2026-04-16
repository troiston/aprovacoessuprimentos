---
id: skill-build-testimonials
title: "Build Testimonials"
agent: 03-builder
version: 1.0
category: components
priority: important
requires:
  - skill: skill-build-social-proof
  - rule: 02-code-style
provides:
  - 3 padrões de testimonials (featured, strip, wall of love)
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Testimonials — Depoimentos que Geram Confiança

## Por que Importa

Testimonials com vídeo convertem **+25%** vs texto. Featured testimonial próximo ao CTA gera **+24%** de conversão. Wall of Love cria efeito de volume ("todo mundo usa"). Depoimentos com foto, nome e cargo são **3x mais críveis** que anônimos.

## 3 Padrões

| Padrão           | Quando usar                          | Layout                     |
|------------------|--------------------------------------|----------------------------|
| Featured Card    | Próximo ao CTA, 1 depoimento forte  | Card grande com foto+quote |
| Testimonial Strip| Seção de social proof, 3-5 cards     | Grid horizontal            |
| Wall of Love     | Página dedicada ou seção de impacto  | Masonry grid               |

## Tipos Compartilhados

```tsx
// lib/types/testimonial.ts
export interface Testimonial {
  id: string;
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar: string;
  };
  rating?: number;
  videoUrl?: string;
}
```

## 1. Featured Testimonial Card

```tsx
// components/testimonials/featured-testimonial.tsx
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types/testimonial";

interface FeaturedTestimonialProps {
  testimonial: Testimonial;
}

export function FeaturedTestimonial({ testimonial }: FeaturedTestimonialProps) {
  const { quote, author, rating } = testimonial;

  return (
    <blockquote className="relative mx-auto max-w-2xl rounded-2xl border border-border bg-background p-8 shadow-lg md:p-10">
      <Quote className="absolute -top-4 left-6 h-8 w-8 text-primary/20" />

      {rating && (
        <div className="mb-4 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={[
                "h-5 w-5",
                i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20",
              ].join(" ")}
            />
          ))}
        </div>
      )}

      <p className="text-lg leading-relaxed text-foreground italic">
        &ldquo;{quote}&rdquo;
      </p>

      <footer className="mt-6 flex items-center gap-4">
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <cite className="not-italic font-semibold text-foreground">
            {author.name}
          </cite>
          <p className="text-sm text-muted-foreground">
            {author.role}, {author.company}
          </p>
        </div>
      </footer>
    </blockquote>
  );
}
```

## 2. Testimonial Strip (3-5 cards)

```tsx
// components/testimonials/testimonial-strip.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types/testimonial";

interface TestimonialStripProps {
  testimonials: Testimonial[];
}

export function TestimonialStrip({ testimonials }: TestimonialStripProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          O que nossos clientes dizem
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 5).map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex flex-col rounded-xl border border-border bg-background p-6"
            >
              {t.rating && (
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      className={[
                        "h-4 w-4",
                        j < t.rating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}

              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <footer className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <Image
                  src={t.author.avatar}
                  alt={t.author.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <div>
                  <cite className="not-italic text-sm font-semibold">{t.author.name}</cite>
                  <p className="text-xs text-muted-foreground">
                    {t.author.role}, {t.author.company}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 3. Wall of Love (Masonry)

```tsx
// components/testimonials/wall-of-love.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Testimonial } from "@/lib/types/testimonial";

interface WallOfLoveProps {
  testimonials: Testimonial[];
  columns?: 2 | 3 | 4;
}

export function WallOfLove({ testimonials, columns = 3 }: WallOfLoveProps) {
  const cols: Testimonial[][] = Array.from({ length: columns }, () => []);
  testimonials.forEach((t, i) => cols[i % columns]!.push(t));

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Wall of Love
        </h2>

        <div className="flex gap-6">
          {cols.map((col, ci) => (
            <div key={ci} className="flex flex-1 flex-col gap-6">
              {col.map((t, ti) => (
                <motion.blockquote
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: (ci + ti) * 0.05, duration: 0.4 }}
                  className="rounded-xl border border-border bg-background p-5"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-4 flex items-center gap-3">
                    <Image
                      src={t.author.avatar}
                      alt={t.author.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <cite className="not-italic text-sm font-semibold">{t.author.name}</cite>
                      <p className="text-xs text-muted-foreground">{t.author.company}</p>
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Video Testimonial Embed

```tsx
// components/testimonials/video-testimonial.tsx
"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import type { Testimonial } from "@/lib/types/testimonial";

interface VideoTestimonialProps {
  testimonial: Testimonial & { videoUrl: string; thumbnailUrl: string };
}

export function VideoTestimonial({ testimonial }: VideoTestimonialProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-xl aspect-video">
      {playing ? (
        <iframe
          src={`${testimonial.videoUrl}?autoplay=1`}
          title={`Depoimento de ${testimonial.author.name}`}
          allow="autoplay; fullscreen"
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label={`Assistir depoimento de ${testimonial.author.name}`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <Image
            src={testimonial.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-7 w-7 text-primary ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}
```

## Checklist

- [ ] Featured testimonial próximo ao CTA principal
- [ ] Foto real + nome + cargo + empresa (nunca anônimo)
- [ ] Rating com estrelas quando disponível
- [ ] Wall of love com masonry layout CSS
- [ ] Video embed com thumbnail + botão play (lazy load)
- [ ] Stagger animation na entrada dos cards
- [ ] Mobile: 1 coluna para strip e wall
