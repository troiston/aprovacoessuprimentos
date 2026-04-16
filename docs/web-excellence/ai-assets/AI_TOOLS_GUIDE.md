---
id: doc-ai-tools-guide
title: Guia de ferramentas de assets com IA
version: 2.1
last_updated: 2026-04-08
category: ai-assets
---

# Guia Completo de Ferramentas de Geracao de Assets com IA

> Referencia pratica para gerar imagens e videos com IA para projetos web.
> Prompts em ingles (exigido pelas ferramentas), documentacao em portugues.

---

## Indice

1. [Ferramentas de Imagem](#ferramentas-de-imagem)
2. [Ferramentas de Video](#ferramentas-de-video)
3. [Quando Usar JSON vs Linguagem Natural](#quando-usar-json-vs-linguagem-natural)
4. [Engenharia de Prompts — Melhores Praticas](#engenharia-de-prompts--melhores-praticas)
5. [Integracao com Next.js](#integracao-com-nextjs)

---

## Ferramentas de Imagem

### Flux 2

**Melhor para:** fotorrealismo (92% de precisao perceptual)

| Caracteristica      | Detalhe                                      |
| ------------------- | -------------------------------------------- |
| Formato de prompt   | JSON estruturado                             |
| Controle de cor     | HEX direto no prompt (`#8B4513`)             |
| Aspect ratios       | Qualquer proporcao personalizada             |
| Resolucao maxima    | Ate 2048×2048                                |
| Ponto forte         | Fidelidade de texturas, iluminacao realista  |

**Quando escolher Flux 2:**

- Fotos de produto que precisam parecer reais
- Retratos e cenas com iluminacao natural
- Quando voce precisa de controle preciso de cores via HEX
- Composicoes que exigem parametros de camera especificos (lente, abertura, ISO)

**Exemplo de uso:**

```json
{
  "prompt": "Close-up of artisan coffee cup on marble surface, steam rising, 85mm f/1.8, natural window light from camera-left, warm color temperature 3200K, shallow depth of field, colors #8B4513 #D2691E #F5DEB3",
  "aspect_ratio": "16:9",
  "output_format": "webp"
}
```

### Midjourney v7

**Melhor para:** qualidade estetica e saida artistica

| Caracteristica      | Detalhe                                        |
| ------------------- | ---------------------------------------------- |
| Formato de prompt   | Linguagem natural com parametros `--`           |
| Style references    | `--sref [URL]` para consistencia de estilo      |
| Character refs      | `--cref [URL]` para consistencia de personagem  |
| Aspect ratios       | `--ar 16:9`                                     |
| Stylize             | `--s 100-1000` controla forca estetica          |

**Quando escolher Midjourney v7:**

- Hero images que precisam de impacto visual alto
- Ilustracoes e composicoes artisticas
- Quando voce tem imagens de referencia de estilo
- Marcas que priorizam estetica sobre fotorrealismo

**Exemplo de uso:**

```
Professional portrait in modern office, soft natural light,
shallow depth of field, warm tones, editorial photography
--ar 16:9 --s 250 --v 7
```

### DALL-E 3

**Melhor para:** renderizacao de texto e acessibilidade para iniciantes

| Caracteristica      | Detalhe                                   |
| ------------------- | ----------------------------------------- |
| Formato de prompt   | Linguagem natural                         |
| Texto em imagens    | Melhor da categoria para texto legivel    |
| Integracao          | API OpenAI, ChatGPT nativo               |
| Seguranca           | Filtros de conteudo integrados            |

**Quando escolher DALL-E 3:**

- Imagens que precisam de texto legivel (banners, mockups com UI)
- Prototipagem rapida sem ajuste fino de parametros
- Quando voce precisa de integracao direta com API OpenAI
- Conteudo que passa por revisao de compliance

---

## Ferramentas de Video

### Runway Gen-3 Alpha Turbo

**Melhor para:** geracao rapida de video com controle de camera via JSON

| Caracteristica      | Detalhe                                        |
| ------------------- | ---------------------------------------------- |
| Formato de prompt   | JSON com `camera_motion`                        |
| Duracao             | Ate 10 segundos                                |
| Controle de camera  | Pan, zoom, tilt, roll (valores numericos)       |
| Resolucao           | 720p / 1080p                                   |
| Velocidade          | Geracao em segundos (Turbo)                     |

**Objeto `camera_motion`:**

```json
{
  "model": "gen3_alpha_turbo",
  "promptText": "Slow orbit around a floating product on dark background, volumetric lighting, particles in air",
  "duration": 5,
  "ratio": "16:9",
  "camera_motion": {
    "pan": 3,
    "zoom": 1,
    "tilt": 0,
    "roll": 0
  }
}
```

- **pan:** -10 (esquerda) a +10 (direita)
- **zoom:** -10 (afastar) a +10 (aproximar)
- **tilt:** -10 (baixo) a +10 (cima)
- **roll:** -10 (anti-horario) a +10 (horario)

**Quando escolher Runway:**

- Background loops para hero sections
- Product reveals com controle preciso de camera
- Quando voce precisa de resultado rapido (Turbo)
- Integracoes automatizadas via API

### Sora 2

**Melhor para:** narrativa temporal e consistencia de personagem

| Caracteristica        | Detalhe                                      |
| --------------------- | -------------------------------------------- |
| Formato de prompt     | Narrativa temporal com transicoes             |
| Duracao               | Ate 20 segundos                              |
| Character references  | Consistencia de personagem entre cenas        |
| Ponto forte           | Fisica realista, movimentos naturais          |

**Formato de narrativa temporal:**

```
Beginning: Camera slowly pushes through morning mist in a cafe interior,
warm golden light filtering through windows.
Middle: Focus shifts to a barista carefully pouring latte art, steam
rising in slow motion, shallow depth of field.
End: Camera pulls back to reveal the full cafe atmosphere, customers
in soft bokeh background, warm amber tones.
```

**Quando escolher Sora 2:**

- Videos com narrativa (inicio, meio, fim)
- Cenas com pessoas que precisam de consistencia visual
- Videos mais longos (ate 20s)
- Quando a fisica e movimentos naturais sao criticos

### Kling 3.0

**Melhor para:** audio nativo e separacao de cenas

| Caracteristica      | Detalhe                                     |
| ------------------- | ------------------------------------------- |
| Formato de prompt   | Separadores `\|` + sintaxe VISUAL/AUDIO     |
| Audio               | Geracao nativa de audio sincronizado         |
| Cenas multiplas     | Separador `\|` entre cenas                   |
| Resolucao           | Ate 1080p                                   |

**Sintaxe VISUAL/AUDIO:**

```
VISUAL: Close-up of espresso machine extracting coffee, rich brown
liquid flowing, steam rising, dramatic side lighting |
AUDIO: Hissing steam, liquid pouring, soft ambient cafe music |
VISUAL: Wide shot of cafe interior, morning light, people in
background, warm atmosphere |
AUDIO: Gentle chatter, cups clinking, acoustic guitar
```

**Quando escolher Kling 3.0:**

- Videos que precisam de audio sincronizado
- Cenas multiplas com transicoes
- Conteudo para redes sociais com som
- Quando audio ambiente importa para a experiencia

---

## Quando Usar JSON vs Linguagem Natural

### Use JSON Estruturado Quando:

- **Precisao tecnica e necessaria** — parametros de camera, cores HEX, aspect ratios
- **Reproducibilidade importa** — voce quer resultados consistentes entre geracoes
- **Automacao** — pipelines que geram assets programaticamente
- **Controle de camera em video** — Runway Gen-3 exige JSON para `camera_motion`
- **Nicho especifico** — templates reutilizaveis por vertical (cafe, SaaS, e-commerce)

### Use Linguagem Natural Quando:

- **Exploracao criativa** — voce ainda esta definindo o estilo visual
- **Midjourney** — a ferramenta e otimizada para linguagem natural
- **Narrativa temporal** — Sora 2 funciona melhor com descricoes narrativas
- **Iteracao rapida** — ajustes rapidos sem editar estrutura JSON
- **DALL-E 3** — projetado para prompts conversacionais

### Abordagem Hibrida (Recomendada):

1. Comece com linguagem natural para explorar direcoes visuais
2. Refine para JSON estruturado quando encontrar o estilo certo
3. Salve como template reutilizavel no diretorio `image-prompts/` ou `video-prompts/`

---

## Engenharia de Prompts — Melhores Praticas

### Especificidade

Prompts vagos geram resultados genericos. Seja preciso:

| Vago                        | Especifico                                                       |
| --------------------------- | ---------------------------------------------------------------- |
| "a coffee cup"              | "artisan ceramic coffee cup on matte black marble surface"       |
| "nice lighting"             | "natural window light from camera-left, 3200K warm temperature"  |
| "blurry background"         | "shallow depth of field, 85mm f/1.8, bokeh circles in background"|

### Parametros de Camera

Usar vocabulario de fotografia real melhora drasticamente os resultados:

**Lentes:**

- `24mm wide` — paisagens, interiores amplos, distorcao dramatica
- `35mm` — street photography, cenas de estilo de vida
- `50mm` — versatil, proxima da visao humana
- `85mm` — retratos, compressao de fundo
- `100mm macro` — detalhes extremos, texturas, close-ups

**Abertura:**

- `f/1.4 – f/1.8` — bokeh extremo, sujeito isolado
- `f/2.8` — bom equilibrio entre foco e desfoque
- `f/4 – f/8` — mais elementos em foco
- `f/11 – f/16` — tudo em foco (paisagens)

**Angulos:**

- `eye-level` — natural, jornalistico
- `low-angle` — poder, grandiosidade
- `high-angle` — vulnerabilidade, visao geral
- `bird-eye` — overhead, flat-lay, composicoes graficas
- `dutch-angle` — tensao, dinamismo

### Vocabulario de Iluminacao

A iluminacao define 80% da qualidade percebida:

- `natural window light` — suave, direcional, versatil
- `golden hour` — tons quentes, sombras longas, aspecto cinematografico
- `studio softbox` — controlada, uniforme, ideal para produto
- `dramatic rim light` — contorno luminoso, fundo escuro
- `neon` — cyberpunk, tecnologico, cores saturadas
- `overcast` — difusa, sem sombras duras
- `candlelight` — intima, quente, romantica

### Negative Prompts

Sempre inclua para evitar artefatos comuns:

```
blurry, distorted, low quality, text, watermark, oversaturated,
artificial, plastic, deformed hands, extra fingers, cropped,
out of frame, duplicate, morbid, mutilated
```

---

## Integracao com Next.js

### Imagens Geradas — `next/image`

```tsx
import Image from "next/image";

export function HeroImage() {
  return (
    <Image
      src="/assets/hero-coffee.webp"
      alt="Xicara de cafe artesanal com vapor em superficie de marmore"
      width={1920}
      height={1080}
      priority
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      sizes="100vw"
      className="object-cover"
    />
  );
}
```

**Boas praticas:**

- Use `priority` para imagens above-the-fold (LCP)
- Sempre defina `sizes` para otimizar o carregamento responsivo
- Gere `blurDataURL` com `plaiceholder` ou salve o base64 no build
- Formato WebP para melhor compressao (30-50% menor que JPEG)
- Alt text descritivo para acessibilidade (WCAG 2.2 AA)

### Gerando Blur Placeholder

```bash
npx plaiceholder ./public/assets/hero-coffee.webp
```

Ou programaticamente:

```ts
import { getPlaiceholder } from "plaiceholder";
import fs from "node:fs";

async function generateBlur(imagePath: string) {
  const buffer = fs.readFileSync(imagePath);
  const { base64 } = await getPlaiceholder(buffer);
  return base64;
}
```

### Video Gerado — Componente de Video

```tsx
"use client";

import { useRef, useEffect } from "react";

interface VideoBackgroundProps {
  src: string;
  poster: string;
  alt: string;
}

export function VideoBackground({ src, poster, alt }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
```

**Boas praticas para video:**

- Sempre `muted` e `playsInline` para autoplay no mobile
- Use `IntersectionObserver` para pausar videos fora da viewport (performance)
- Defina `poster` com frame estatico para carregamento inicial
- `preload="metadata"` para nao baixar o video inteiro na carga
- `aria-label` para acessibilidade (leitor de tela)
- Formato MP4 (H.264) para compatibilidade universal

### Organizacao de Assets no Projeto

```
public/
  assets/
    images/
      hero-coffee.webp        ← Gerado com Flux 2
      team-photo.webp          ← Gerado com Midjourney v7
      product-mockup.webp      ← Gerado com DALL-E 3
    videos/
      hero-loop.mp4            ← Gerado com Runway Gen-3
      product-reveal.mp4       ← Gerado com Sora 2
      poster-hero-loop.webp    ← Frame estatico para poster
```

### Otimizacao de Performance

| Metrica | Budget   | Como Atingir                                |
| ------- | -------- | ------------------------------------------- |
| LCP     | < 2.5s   | `priority` no hero, WebP, `sizes` correto   |
| CLS     | < 0.1    | `width`/`height` explicitos, `placeholder`   |
| INP     | < 200ms  | Lazy-load videos, IntersectionObserver       |
| JS      | < 200KB  | Video component como `use client` isolado    |

---

## Estrutura dos Templates

```
docs/ai-assets/
  AI_TOOLS_GUIDE.md              ← Este guia
  image-prompts/
    _PROMPT_TEMPLATE.json        ← Template base de imagem
    nicho-cafe.json              ← 5 prompts para cafeterias
    nicho-saas.json              ← 5 prompts para SaaS/tech
    nicho-ecommerce.json         ← 5 prompts para e-commerce
    nicho-portfolio.json         ← 5 prompts para portfolio criativo
    nicho-restaurante.json       ← 5 prompts para restaurantes
  video-prompts/
    _VIDEO_TEMPLATE.json         ← Template base de video
    hero-loop.json               ← 3 prompts para loops de hero
    product-reveal.json          ← 3 prompts para reveals de produto
    lifestyle-scene.json         ← 3 prompts para cenas lifestyle
```

Cada JSON segue a estrutura do template correspondente e contem prompts
reais prontos para uso — basta copiar e colar na ferramenta de IA escolhida.
