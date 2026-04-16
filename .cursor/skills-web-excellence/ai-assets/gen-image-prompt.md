---
id: skill-gen-image-prompt
title: "Generate Image Prompt"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: important
requires:
  - rule: 00-constitution
provides:
  - structured-image-prompts
  - flux-midjourney-prompts
used_by:
  - agent: 05-asset-creator
  - command: /gen-image
---

# Prompts Estruturados para Geração de Imagem

## Modelos Alvo

- **Flux 2** — melhor para fotorrealismo e controle de composição
- **Midjourney v7** — melhor para estilo artístico e texturas

## Template JSON — 8 Campos Obrigatórios

```json
{
  "subject": "Descrição do sujeito principal com detalhes específicos",
  "setting": "Ambiente/cenário onde o sujeito está",
  "camera": {
    "lens": "85mm",
    "aperture": "f/1.8",
    "angle": "eye level",
    "distance": "medium close-up"
  },
  "lighting": {
    "type": "natural window light",
    "direction": "side left 45°",
    "mood": "warm and inviting",
    "color_temp": "5500K daylight"
  },
  "style": "editorial photography, high-end commercial",
  "color_palette": ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#f5f5f5"],
  "aspect_ratio": "16:9",
  "negative_prompt": "blurry, low quality, text, watermark, distorted, oversaturated"
}
```

## Guia de Lentes

| Lente | Uso | Efeito |
|-------|-----|--------|
| 24mm wide | Ambientes, arquitetura | Expansivo, contexto amplo |
| 35mm wide | Street, lifestyle | Natural, documental |
| 50mm standard | Versátil, produtos | Perspectiva humana |
| 85mm portrait | Retratos, detalhes | Bokeh cremoso, íntimo |
| 135mm telephoto | Compressão, close-up | Fundo desfocado, drama |
| Macro 100mm | Texturas, micro detalhes | Ultra detalhe |

## Guia de Iluminação

| Tipo | Descrição | Melhor para |
|------|-----------|-------------|
| Natural window | Luz de janela lateral | Produtos, lifestyle |
| Studio softbox | Luz suave difusa | E-commerce, retratos |
| Golden hour | Luz dourada pôr do sol | Hero images, outdoor |
| Neon/urbano | Luzes coloridas artificiais | Tech, nightlife |
| Dramatic rim | Contraluz dramática | Silhuetas, drama |
| Flat/difusa | Sem sombras marcadas | Minimalismo, clean |
| Rembrandt | Triângulo de luz no rosto | Retratos clássicos |

## Processo de Construção do Prompt

```
1. SUJEITO → O que/quem é o foco? Detalhes específicos (idade, cor, material, textura)
2. CENÁRIO → Onde está? Interior/exterior? Elementos de fundo?
3. CÂMERA → Proximidade? Lente? Ângulo? (eye-level, low-angle, bird's-eye)
4. LUZ → Fonte? Direção? Temperatura? Mood?
5. ESTILO → Fotorrealismo? Ilustração? Qual referência visual?
6. CORES → Paleta dominante? Contraste? Saturação?
7. PROPORÇÃO → 16:9 hero, 1:1 card, 9:16 stories, 4:5 feed
8. EXCLUIR → O que NÃO queremos? (texto, blur, distorção)
```

## Exemplos Completos

### Hero Image — Café Artesanal

```json
{
  "subject": "Steaming artisanal latte with intricate rosetta art in a handcrafted ceramic cup, coffee beans scattered on a dark oak table",
  "setting": "Cozy coffee shop interior with exposed brick wall, soft morning light through floor-to-ceiling windows, blurred vintage shelves in background",
  "camera": {
    "lens": "50mm",
    "aperture": "f/2.0",
    "angle": "slightly above, 30° downward",
    "distance": "close-up"
  },
  "lighting": {
    "type": "natural window light",
    "direction": "side left at 45°",
    "mood": "warm, inviting, morning glow",
    "color_temp": "4000K warm"
  },
  "style": "editorial food photography, high-end cafe magazine, shallow depth of field",
  "color_palette": ["#2c1810", "#6b4423", "#d4a574", "#f5e6d3", "#ffffff"],
  "aspect_ratio": "16:9",
  "negative_prompt": "artificial looking, plastic, oversaturated, blurry, text overlay, stock photo feel"
}
```

### Produto — SaaS Dashboard

```json
{
  "subject": "Sleek laptop displaying a modern analytics dashboard with colorful charts and metrics, clean UI with blue accent colors",
  "setting": "Minimalist white desk workspace, small succulent plant to the right, subtle shadows, clean and organized",
  "camera": {
    "lens": "35mm",
    "aperture": "f/4.0",
    "angle": "three-quarter view from above left, 45° angle",
    "distance": "medium shot"
  },
  "lighting": {
    "type": "studio softbox",
    "direction": "top-front, slightly left",
    "mood": "clean, professional, tech-forward",
    "color_temp": "5500K neutral daylight"
  },
  "style": "commercial product photography, tech startup aesthetic, Apple-inspired minimalism",
  "color_palette": ["#0f172a", "#3b82f6", "#60a5fa", "#f8fafc", "#e2e8f0"],
  "aspect_ratio": "16:9",
  "negative_prompt": "cluttered, messy desk, visible brand logos, reflections on screen, unrealistic screen content"
}
```

### Lifestyle — E-commerce de Moda

```json
{
  "subject": "Young Brazilian woman wearing an oversized linen blazer in sand color over white t-shirt, natural confident pose, looking to the side",
  "setting": "Urban rooftop terrace at golden hour, São Paulo skyline softly blurred in background, concrete planters with greenery",
  "camera": {
    "lens": "85mm",
    "aperture": "f/1.8",
    "angle": "eye level, slight right",
    "distance": "medium shot, waist up"
  },
  "lighting": {
    "type": "golden hour backlight",
    "direction": "behind subject, rim light on hair and shoulders",
    "mood": "warm, aspirational, effortless",
    "color_temp": "3500K golden"
  },
  "style": "fashion editorial, street style, Vogue Brasil aesthetic",
  "color_palette": ["#d4a574", "#c2956b", "#f5e6d3", "#2c3e50", "#ecf0f1"],
  "aspect_ratio": "4:5",
  "negative_prompt": "studio background, stiff pose, overly retouched, plastic skin, heavy makeup"
}
```

### Textura — Background para Seção

```json
{
  "subject": "Abstract flowing gradient texture with subtle grain noise, organic curves blending dark navy into deep purple",
  "setting": "No specific setting — pure abstract composition",
  "camera": {
    "lens": "macro conceptual",
    "aperture": "n/a",
    "angle": "frontal, flat composition",
    "distance": "full frame fill"
  },
  "lighting": {
    "type": "internal glow, self-luminous",
    "direction": "emanating from center-left",
    "mood": "mysterious, premium, deep",
    "color_temp": "cool 7000K"
  },
  "style": "abstract digital art, grain texture overlay, premium dark UI background",
  "color_palette": ["#0f172a", "#1e1b4b", "#312e81", "#4338ca", "#6366f1"],
  "aspect_ratio": "16:9",
  "negative_prompt": "sharp edges, geometric patterns, text, recognizable objects, flat solid color"
}
```

### Ambiente — Página 404 / Ilustração

```json
{
  "subject": "Lone astronaut sitting on the edge of a floating rock in deep space, holding a small glowing map, looking lost but calm",
  "setting": "Vast cosmic space with distant nebulae in purple and teal, scattered asteroid fragments, tiny distant planet",
  "camera": {
    "lens": "24mm wide",
    "aperture": "f/8",
    "angle": "low angle looking up at astronaut",
    "distance": "wide establishing shot"
  },
  "lighting": {
    "type": "rim light from distant star",
    "direction": "behind and above, creating silhouette edges",
    "mood": "contemplative, vast, lonely but hopeful",
    "color_temp": "mixed — cool 8000K ambient + warm 3000K from map glow"
  },
  "style": "digital illustration, semi-realistic, Pixar concept art influence, soft painterly edges",
  "color_palette": ["#0d1117", "#1a1a3e", "#4c1d95", "#06b6d4", "#fbbf24"],
  "aspect_ratio": "16:9",
  "negative_prompt": "cartoon, childish, anime, photorealistic human face, text"
}
```

## Adaptação por Nicho do Projeto

Detectar o nicho do projeto e ajustar automaticamente:
- **Café/Restaurante** → warm tones, food photography, natural light
- **SaaS/Tech** → cool tones, clean minimalism, product shots
- **E-commerce Moda** → lifestyle, editorial, golden hour
- **Portfolio Criativo** → dramatic lighting, bold colors, artistic
- **Imobiliário** → wide angle, natural light, aspirational spaces
