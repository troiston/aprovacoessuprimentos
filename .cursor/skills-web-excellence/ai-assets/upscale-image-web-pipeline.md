---
id: skill-upscale-image-web-pipeline
title: "Upscale & Web Image Pipeline"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: important
requires:
  - rule: 00-constitution
  - skill: skill-optimize-images
provides:
  - image-upscale-workflow
  - web-format-conversion-pipeline
  - optimized-web-assets
used_by:
  - agent: 05-asset-creator
  - agent: 06-qa-auditor
  - command: /gen-image
---

# Upscale & Pipeline de Imagem para Web

Pipeline completo: imagem gerada/fotografada → upscale → otimização → formatos web → integração com `next/image`.

## Visão Geral do Pipeline

```
┌─────────────┐    ┌───────────┐    ┌──────────────┐    ┌──────────────┐
│ FONTE       │───▶│ UPSCALE   │───▶│ MASTER       │───▶│ ENTREGA WEB  │
│ AI / Foto   │    │ 2× ou 4×  │    │ JPEG/PNG     │    │ AVIF + WebP  │
│ ~1024px     │    │           │    │ Alta qualidade│    │ via next/image│
└─────────────┘    └───────────┘    └──────────────┘    └──────────────┘
```

## Etapa 1 — Upscale

### Quando Fazer Upscale

| Cenário | Upscale? | Factor | Motivo |
|---------|----------|--------|--------|
| AI gerou 1024×1024 e destino é hero 1920px | Sim | 2× | Resolução insuficiente para retina |
| AI gerou 1024×1024 e destino é card 400px | Não | — | Já tem resolução suficiente |
| Foto de celular 4000×3000 | Não | — | Resolução nativa é boa |
| Foto antiga/scan 640×480 | Sim | 4× | Resolução muito baixa |

### Regra: resolução master ≥ 2× a largura máxima exibida
Se o site exibe a imagem a no máximo 600px de largura CSS → master deve ter ≥ 1200px de largura (para telas retina 2×).

### Ferramentas de Upscale

#### Real-ESRGAN (recomendado para fotos)
```bash
# Instalar
pip install realesrgan

# Upscale 2× — melhor para fotos e retratos
python -m realesrgan -i input.jpg -o output.jpg -s 2

# Upscale 4× — para imagens muito pequenas
python -m realesrgan -i input.jpg -o output.jpg -s 4
```

#### Sharp (Node.js — resize/interpolação, não AI)
```bash
# Para resize simples (não upscale AI-based)
npx sharp-cli resize 1920 --input input.jpg --output output.jpg
```

#### Serviços Online (alternativa sem instalação)
- **Upscayl** — open source, desktop, Real-ESRGAN sob o capô
- **Topaz Gigapixel** — comercial, melhor qualidade para rostos
- **waifu2x** — bom para ilustrações/anime

### Cuidados com Upscale

- **Rostos**: Real-ESRGAN com modelo `RealESRGAN_x2plus` preserva melhor detalhes faciais
- **Nunca**: upscale > 4× em uma passada (artefatos). Prefira 2× + 2× em sequência
- **Verificar**: sempre inspecionar resultado em 100% de zoom antes de usar
- **Textura de pele**: upscale agressivo pode criar textura artificial — comparar com original

## Etapa 2 — Master de Alta Qualidade

O arquivo "master" é a versão de maior qualidade que armazenamos no repositório (pasta `public/`). O Next.js gera variantes otimizadas a partir dele.

### Formato do Master

| Formato | Quando Usar | Qualidade | Tamanho |
|---------|-------------|-----------|---------|
| **JPEG** | Fotos, retratos, paisagens | 90-95 | Médio |
| **PNG** | Precisa de transparência (logos, ícones) | Lossless | Grande |
| **WebP** | Master alternativo (menor que JPEG) | 90 | ~30% menor |

**Recomendação padrão**: JPEG quality 90 para o master em `public/`. O Next.js converte para AVIF/WebP na entrega.

### Conversão para Master com Sharp

```bash
# JPEG otimizado (qualidade 90, progressive, strip metadata)
npx sharp-cli --input original.png --output master.jpg --quality 90 --progressive --withoutMetadata

# Se a fonte já é JPEG, otimizar sem recomprimir demais
npx sharp-cli --input foto.jpg --output master.jpg --quality 92 --progressive
```

## Etapa 3 — Entrega Web (AVIF + WebP)

### O Next.js faz o trabalho pesado

Com a config correta, `next/image` converte automaticamente:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};
```

O browser recebe:
1. **AVIF** se suportar (~50% menor que JPEG, qualidade superior)
2. **WebP** se não suportar AVIF (~30% menor que JPEG)
3. **JPEG** como fallback final

### Comparação de Formatos

| Formato | Compressão | Qualidade Visual | Suporte Browser | Transparência |
|---------|-----------|-----------------|----------------|---------------|
| **AVIF** | Melhor (~50% menor que JPEG) | Excelente | 93%+ moderno | Sim |
| **WebP** | Muito bom (~30% menor) | Muito boa | 97%+ | Sim |
| **JPEG** | Baseline | Boa | 100% | Não |
| **PNG** | Sem perda | Perfeita | 100% | Sim |

**AVIF é o formato ideal para web**: melhor compressão com melhor qualidade visual. WebP como fallback garante cobertura total.

### Uso Correto no Componente

```tsx
import Image from "next/image";

<Image
  src="/sobre-retrato.jpg"          // Master JPEG no public/
  alt="Descrição significativa"
  fill                                // Layout fill para containers
  sizes="(max-width: 1023px) 100vw, 45vw"  // Responsivo
  quality={80}                        // Equilíbrio qualidade/peso
  priority                            // Se acima da dobra (LCP)
  className="object-cover object-top" // Crop inteligente
/>
```

### Quality por Contexto

| Contexto | `quality` | Justificativa |
|----------|----------|---------------|
| Hero / Sobre (foto acima da dobra) | 80 | Alta qualidade visual, priority |
| Galeria / Portfolio | 75 | Equilíbrio — muitas imagens |
| Cards / Thumbnails | 65 | Tamanho pequeno na tela |
| Backgrounds / Texturas | 60 | Foco não está na imagem |

## Etapa 4 — Conversão Manual (quando necessário)

Se precisar converter manualmente (ex: exportar para redes sociais, email marketing):

### Sharp CLI

```bash
# JPEG → WebP
npx sharp-cli --input master.jpg --output web.webp --format webp --quality 82

# JPEG → AVIF
npx sharp-cli --input master.jpg --output web.avif --format avif --quality 65

# Resize + converter
npx sharp-cli resize 1200 --input master.jpg --output thumb.webp --format webp --quality 75
```

### ffmpeg (alternativa)

```bash
# JPEG → AVIF com libaom
ffmpeg -i master.jpg -c:v libaom-av1 -still-picture 1 -crf 32 output.avif

# JPEG → WebP
ffmpeg -i master.jpg -quality 82 output.webp
```

## Checklist do Pipeline

- [ ] Imagem fonte tem resolução suficiente? (≥ 2× do display máximo)
- [ ] Se não → upscale com Real-ESRGAN (verificar resultado em 100% zoom)
- [ ] Master salvo em JPEG quality 90 em `public/`
- [ ] `next.config.ts` tem `formats: ["image/avif", "image/webp"]`
- [ ] Componente usa `next/image` com `sizes` correto
- [ ] `quality` adequado ao contexto (ver tabela)
- [ ] `priority` em imagens acima da dobra
- [ ] `alt` descritivo para acessibilidade
- [ ] Testar: DevTools → Network → verificar que AVIF ou WebP é servido
