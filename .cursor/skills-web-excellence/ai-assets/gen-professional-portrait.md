---
id: skill-gen-professional-portrait
title: "Generate Professional Portrait"
agent: 05-asset-creator
version: 1.0
category: ai-assets
priority: important
requires:
  - rule: 00-constitution
  - skill: skill-gen-image-prompt
provides:
  - studio-quality-portrait-prompts
  - executive-editorial-portrait-assets
used_by:
  - agent: 05-asset-creator
  - command: /gen-image
---

# Retrato Profissional de Estúdio — Prompts e Pipeline

Skill dedicada a gerar retratos de qualidade editorial/estúdio para uso em sites, redes sociais e materiais de marca pessoal. Estende a skill `gen-image-prompt` com parametrização específica para rostos e meio-corpo.

## Quando Usar

- Seção "Sobre" / "Equipe" de sites
- Fotos de perfil profissional (LinkedIn, bio de autor)
- Material de marca pessoal / personal branding
- Headshots corporativos

## Template JSON — Retrato Profissional

Estende o template base de 8 campos com parametrização específica para retratos.

```json
{
  "subject": {
    "description": "Descrição detalhada da pessoa (gênero, faixa etária, etnia, traços)",
    "expression": "confident and approachable, subtle smile, direct eye contact",
    "attire": "tailored dark navy blazer over crisp white shirt, no tie",
    "posture": "relaxed shoulders, slight body turn 15° to camera-right, face toward camera",
    "grooming": "well-groomed, natural skin texture, minimal retouching feel"
  },
  "setting": "professional photo studio, seamless backdrop in warm neutral gray (#a8a29e), shallow depth of field",
  "camera": {
    "lens": "85mm",
    "aperture": "f/2.0",
    "angle": "eye level, camera positioned slightly right of center",
    "distance": "medium close-up, chest and above",
    "sensor": "full-frame, high resolution"
  },
  "lighting": {
    "key": "large octagonal softbox, 45° camera-left, slightly above eye level",
    "fill": "reflector panel camera-right, 1:2 ratio to key",
    "hair": "strip softbox behind subject camera-left for edge separation",
    "background": "subtle gradient falloff, darker edges",
    "mood": "confident, warm, approachable",
    "color_temp": "5200K neutral-warm"
  },
  "style": "high-end editorial headshot, Fortune 500 executive portrait, GQ editorial",
  "color_palette": ["#1a1a2e", "#4a4a5a", "#a8a29e", "#d4c5b2", "#f5f0eb"],
  "aspect_ratio": "3:4",
  "negative_prompt": "blurry, distorted features, asymmetric face, plastic skin, over-retouched, airbrushed, uncanny valley, cartoon, painting, multiple people, text, watermark, bad hands, extra fingers"
}
```

## Estilos de Retrato

### Executivo / Corporativo
```json
{
  "subject.attire": "tailored charcoal suit, subtle pattern, crisp white shirt",
  "setting": "seamless dark gray backdrop, vignette",
  "lighting.mood": "authoritative yet approachable",
  "lighting.key": "beauty dish with grid, 30° camera-left",
  "style": "Fortune 500 CEO portrait, corporate annual report"
}
```

### Editorial / Marca Pessoal
```json
{
  "subject.attire": "smart casual — dark blazer, open collar shirt",
  "subject.posture": "arms crossed or one hand at chin, relaxed confidence",
  "setting": "environmental — modern office with warm tones, bokeh background",
  "lighting.mood": "warm, dynamic, story-telling",
  "lighting.key": "natural window light + reflector fill",
  "style": "editorial portrait, personal branding, Forbes profile"
}
```

### Lifestyle / Approachable
```json
{
  "subject.attire": "smart casual, earth tones, minimal accessories",
  "subject.expression": "genuine warm smile, relaxed eyes, approachable",
  "setting": "outdoor golden hour, blurred urban/nature background",
  "lighting.key": "golden hour backlight with reflector fill on face",
  "lighting.color_temp": "3800K warm golden",
  "style": "lifestyle portrait, natural light, warm editorial"
}
```

## Guia de Iluminação para Rostos

| Padrão | Efeito | Quando Usar |
|--------|--------|-------------|
| Butterfly / Paramount | Sombra borboleta sob nariz, glamoroso | Rostos simétricos, feminino |
| Rembrandt | Triângulo de luz na bochecha oposta | Drama, profundidade, masculino |
| Loop | Sombra suave descendo do nariz | Versátil, maioria dos rostos |
| Split | Meio rosto iluminado, meio escuro | Alto drama, artístico |
| Broad | Lado do rosto virado para câmera iluminado | Rostos finos, adiciona volume |
| Short | Lado oposto à câmera iluminado | Rostos largos, emagrecimento visual |

## Proporções por Uso

| Destino | Aspect Ratio | Resolução Mínima | Observação |
|---------|-------------|-------------------|------------|
| Site — Sobre/Bio | 3:4 (retrato) | 1200×1600px | Melhor ocupação vertical |
| Site — Hero | 16:9 (paisagem) | 1920×1080px | Enquadramento ambiental |
| LinkedIn / Perfil | 1:1 (quadrado) | 800×800px | Crop central do rosto |
| Stories / Reels | 9:16 (vertical) | 1080×1920px | Full-body ou meio-corpo |
| Card / Thumbnail | 4:3 | 600×450px | Crop apertado no rosto |

## Referências de Imagem

Quando imagens de referência estiverem disponíveis (fotos reais da pessoa):

1. **Incluir no mínimo 2** referências de ângulos diferentes
2. **Descrever traços** explicitamente no prompt (tom de pele, estrutura facial, cabelo)
3. **Manter consistência** entre variantes geradas — mesma paleta de cores, iluminação, vestuário
4. **Nunca gerar** sem referência quando a semelhança facial é requisito

## Negative Prompts Específicos para Retratos

```
blurry, soft focus on eyes, distorted facial features, asymmetric eyes,
plastic skin, over-retouched, airbrushed, uncanny valley, cartoon,
painting, illustration, multiple people, extra fingers, bad hands,
text, watermark, logo, frame, border, deformed ears, cross-eyed,
double chin artifact, neck too long, shoulders misaligned,
background objects growing from head, harsh shadows on face,
red eye, yellow teeth, unnatural hair color, wig-like hair
```

## Checklist de Qualidade

- [ ] Olhos nítidos e em foco (ponto focal mais importante)
- [ ] Textura de pele natural — sem efeito porcelana
- [ ] Iluminação consistente — sem sombras contraditórias
- [ ] Proporções faciais realistas
- [ ] Fundo não compete com o sujeito
- [ ] Vestuário apropriado ao contexto
- [ ] Resolução adequada ao destino (ver tabela acima)
- [ ] Aspect ratio correto para o layout do site
