---
id: skill-gen-video-prompt
title: "Generate Video Prompt"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: important
requires:
  - skill: skill-gen-image-prompt
  - rule: 00-constitution
provides:
  - structured-video-prompts
  - runway-sora-kling-prompts
used_by:
  - agent: 05-asset-creator
  - command: /gen-image
---

# Prompts Estruturados para Geração de Vídeo

## Modelos Alvo

| Modelo | Força | Duração Max | Resolução |
|--------|-------|:-----------:|-----------|
| Runway Gen-3 Alpha Turbo | Controle de câmera preciso | 10s | 1280×768 |
| Sora 2 | Narrativa temporal coerente | 20s | 1920×1080 |
| Kling 3.0 | Movimento realista + áudio | 10s | 1920×1080 |

## Vocabulário de Câmera

### Movimentos

| Movimento | Descrição | Uso Ideal |
|-----------|-----------|-----------|
| Static | Câmera fixa, tripé | Produto, depoimento |
| Dolly in | Avança em direção ao sujeito | Revelação, foco |
| Dolly out | Afasta do sujeito | Contexto, panorama |
| Pan left/right | Gira horizontalmente | Explorar cenário |
| Tilt up/down | Gira verticalmente | Revelar altura |
| Tracking | Segue sujeito lateralmente | Movimento, ação |
| Drone ascend | Sobe verticalmente | Épico, estabelecimento |
| Handheld | Tremor sutil, orgânico | Documental, autêntico |
| Steadicam | Suave flutuando pelo cenário | Imersivo, cinematic |
| Orbit | Gira ao redor do sujeito | 360°, produto |
| Crane | Arco vertical descendente | Dramático, revelação |

### Enquadramentos

| Frame | Cobertura | Uso |
|-------|-----------|-----|
| Extreme close-up (ECU) | Detalhe (olho, textura) | Emoção, textura |
| Close-up (CU) | Rosto, produto inteiro | Intimidade, detalhe |
| Medium close-up (MCU) | Peito e acima | Conversa, demonstração |
| Medium shot (MS) | Cintura e acima | Ação, apresentação |
| Wide shot (WS) | Corpo inteiro + contexto | Estabelecimento |
| Extreme wide (EWS) | Paisagem dominante | Épico, escala |
| Bird's eye | Vista aérea de cima | Padrões, mapa |

## Template Runway Gen-3

```json
{
  "model": "runway-gen3-alpha-turbo",
  "prompt": {
    "scene": "Steaming artisanal coffee being poured into a handcrafted ceramic cup on a dark oak counter",
    "motion": "Smooth liquid pour from a copper kettle, steam rising and curling, coffee surface rippling concentrically",
    "camera_work": "slow dolly in from medium shot to close-up",
    "duration": "5s",
    "style": "cinematic, shallow depth of field, warm color grading"
  },
  "camera_motion": {
    "horizontal": 0,
    "vertical": 0,
    "zoom": 3.5,
    "pan": 0,
    "tilt": -1.0,
    "roll": 0
  },
  "aspect_ratio": "16:9"
}
```

Campos `camera_motion` do Runway (escala 0.1 a 10):
- `horizontal` — movimento lateral (negativo = esquerda, positivo = direita)
- `vertical` — movimento vertical (negativo = baixo, positivo = cima)
- `zoom` — dolly in (positivo) / out (negativo)
- `pan` — rotação horizontal da câmera
- `tilt` — rotação vertical da câmera
- `roll` — rotação no eixo da lente

## Template Sora 2

Sora funciona melhor com narrativa temporal dividida em início/meio/fim:

```json
{
  "model": "sora-2",
  "prompt": {
    "narrative": {
      "beginning": "A dark empty screen slowly illuminates to reveal a laptop on a minimalist desk. The screen is off. Morning light begins to creep through floor-to-ceiling windows.",
      "middle": "The laptop screen flickers to life, displaying a beautiful analytics dashboard with blue and purple gradients. Data visualizations animate in smoothly — bar charts rising, line graphs drawing, numbers counting up.",
      "end": "Camera slowly pulls back to reveal the full modern office space, bathed in golden morning light. A coffee cup steams gently beside the laptop. The dashboard glows invitingly."
    },
    "duration": "15s",
    "style": "cinematic commercial, Apple product launch aesthetic, shallow depth of field transitions",
    "camera_work": "Start static close-up on laptop, then gentle crane movement pulling back and up to medium wide shot"
  },
  "resolution": "1920x1080",
  "aspect_ratio": "16:9"
}
```

## Template Kling 3.0

Kling usa separadores `|` para segmentos e suporta sintaxe VISUAL/AUDIO:

```json
{
  "model": "kling-3.0",
  "prompt": {
    "raw": "VISUAL: Close-up of hands carefully placing a freshly baked croissant on a wooden board, golden flaky layers visible, steam gently rising | Camera slowly orbits around the pastry, revealing its layers and texture | Wide shot of the rustic bakery counter with morning light streaming through the window. AUDIO: Soft ambient cafe sounds, gentle piano music, subtle crunch of pastry",
    "duration": "8s",
    "style": "food commercial, warm cinematic, 24fps film grain"
  },
  "aspect_ratio": "16:9",
  "mode": "professional"
}
```

Sintaxe Kling:
- `|` separa segmentos temporais sequenciais
- `VISUAL:` descreve o que se vê
- `AUDIO:` descreve som/música desejados
- `mode: professional` ativa qualidade máxima

## Exemplos por Caso de Uso

### Hero Loop (Background de Site)

```json
{
  "model": "runway-gen3-alpha-turbo",
  "prompt": {
    "scene": "Abstract dark fluid motion with deep navy and purple gradients, organic blobby shapes slowly morphing and blending, subtle particle effects floating",
    "motion": "Extremely slow, hypnotic morphing of liquid shapes, particles drifting upward gently",
    "camera_work": "static camera, no movement",
    "duration": "10s",
    "style": "abstract motion graphics, seamless loop, dark premium UI aesthetic"
  },
  "camera_motion": {
    "horizontal": 0,
    "vertical": 0,
    "zoom": 0,
    "pan": 0,
    "tilt": 0,
    "roll": 0
  },
  "notes": "Será usado como background loop — primeiro e último frame devem ser similares para loop suave"
}
```

### Product Reveal (Lançamento)

```json
{
  "model": "sora-2",
  "prompt": {
    "narrative": {
      "beginning": "Pure black screen. A single point of blue-white light appears in the center and begins to grow.",
      "middle": "The light expands and reveals a sleek smartphone floating in space, slowly rotating. Holographic UI elements materialize around it — notification badges, app icons, chat bubbles — all floating and gently orbiting the device.",
      "end": "Camera racks focus to the phone screen showing the product interface. All floating elements settle into place. A bold tagline appears: clean sans-serif white text against the dark background."
    },
    "duration": "12s",
    "style": "tech product launch, Samsung/Apple Keynote aesthetic, volumetric lighting, dark background",
    "camera_work": "Begin static, then orbit 180° around phone, end with frontal close-up"
  }
}
```

### Lifestyle Scene (Marca)

```json
{
  "model": "kling-3.0",
  "prompt": {
    "raw": "VISUAL: Young woman walks confidently through a sun-drenched São Paulo street market, wearing a flowing summer dress, natural smile | She stops at a flower stand, picks up sunflowers, smells them with eyes closed | Wide shot of her continuing to walk, flowers in hand, city skyline in soft focus background. AUDIO: Upbeat acoustic guitar, natural street ambience, birds chirping",
    "duration": "10s",
    "style": "lifestyle commercial, warm natural tones, 24fps cinematic"
  }
}
```

## Dicas de Qualidade

1. **Seja específico com movimento** — "slow dolly in" > "camera moves forward"
2. **Descreva transições** — "cross-dissolve from close-up to wide"
3. **Limite ações por segmento** — 1 ação principal por 3-5s de vídeo
4. **Evite texto em vídeo** — IA gera texto ilegível; adicione em pós-produção
5. **Para loops** — descreva primeiro e último frame similares
6. **Consistência de estilo** — defina grade de cor no campo style
