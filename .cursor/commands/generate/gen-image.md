---
id: cmd-gen-image
title: Gerar Prompt de Imagem
version: 2.0
last_updated: 2026-04-07
category: generate
agent: 05-asset-creator
skills:
  - gen-image-prompt
---

# `/gen-image [contexto] [nicho]`

Gera prompts otimizados para geração de imagens via IA (Flux 2, Midjourney, DALL-E 3). Carrega templates por nicho, adapta ao contexto, injeta cores da marca extraídas dos design tokens, e produz JSON estruturado pronto para uso.

---

## Parâmetros

| Parâmetro | Obrigatório | Valores Aceitos | Descrição |
|-----------|-------------|-----------------|-----------|
| `contexto` | ✅ Sim | `hero` · `product` · `lifestyle` · `texture` · `environment` · `portrait` · `team` | Tipo de imagem que define enquadramento, iluminação e composição |
| `nicho` | ✅ Sim | `cafe` · `saas` · `ecommerce` · `portfolio` · `restaurante` · `health` · `fashion` · `tech` | Nicho que define paleta visual, objetos e atmosfera |

---

## Templates de Nicho

### `cafe`
- **Objetos:** Xícaras de cerâmica, grãos de café, espresso, latte art, bolo, croissant
- **Ambientes:** Cafeteria artesanal, bancada de madeira, jardim, torrefação
- **Iluminação:** Luz natural quente, golden hour, side lighting
- **Paleta:** Marrons, âmbar, creme, verde musgo, terracota

### `saas`
- **Objetos:** Dashboards, interfaces, gráficos, dispositivos, equipes trabalhando
- **Ambientes:** Escritório moderno, home office, coworking, abstrato tech
- **Iluminação:** Clean, difusa, gradientes sutis, neon accent
- **Paleta:** Azuis, violetas, brancos, gradientes modernos

### `ecommerce`
- **Objetos:** Produtos em pedestal, embalagens, unboxing, flat lay
- **Ambientes:** Estúdio minimalista, lifestyle setting, cenário aspiracional
- **Iluminação:** Estúdio profissional, rim light, product spotlight
- **Paleta:** Neutros com accent da marca, fundos limpos

### `portfolio`
- **Objetos:** Workspace criativo, ferramentas de design, projetos, telas
- **Ambientes:** Estúdio criativo, galeria, espaço minimalista
- **Iluminação:** Dramática, side light, contrastes intencionais
- **Paleta:** Monocromática com accent vibrante

### `restaurante`
- **Objetos:** Pratos finalizados, ingredientes, chef cooking, mise en place
- **Ambientes:** Cozinha profissional, mesa posta, terraço, bar
- **Iluminação:** Warm ambient, candlelight, food photography lighting
- **Paleta:** Tons quentes, dourados, verdes herb, vermelho tomate

### `health`
- **Objetos:** Profissionais de saúde, equipamentos, natureza, wellness
- **Ambientes:** Clínica moderna, consultório, spa, outdoor wellness
- **Iluminação:** Limpa, natural, arejada, transmitindo confiança
- **Paleta:** Azuis claros, verdes, brancos, tons suaves

### `fashion`
- **Objetos:** Peças de roupa, acessórios, modelos, texturas
- **Ambientes:** Estúdio, urbano, editorial, passarela
- **Iluminação:** Editorial, beauty light, high contrast, backlit
- **Paleta:** Neutros sofisticados, preto/branco com accent

### `tech`
- **Objetos:** Dispositivos, circuitos, código, interfaces futuristas
- **Ambientes:** Datacenter, lab, escritório tech, abstrato digital
- **Iluminação:** Neon, blue glow, clean tech, volumétrica
- **Paleta:** Azuis escuros, neon cyan/violet, gradientes tech

---

## Mapeamento de Contexto → Composição

| Contexto | Aspect Ratio | Composição | Foco |
|----------|-------------|------------|------|
| `hero` | 16:9 ou 3:2 | Ampla, espaço para texto overlay | Atmosfera e impacto visual |
| `product` | 1:1 ou 4:5 | Centralizado, fundo limpo | Objeto com máximo detalhe |
| `lifestyle` | 16:9 ou 4:3 | Contextual, pessoa usando produto | Emoção e conexão humana |
| `texture` | 1:1 | Full-frame, seamless | Padrão repetível para backgrounds |
| `environment` | 16:9 | Panorâmica ou estabelecimento | Local e atmosfera |
| `portrait` | 3:4 ou 2:3 | Meio corpo ou close | Expressão e personalidade |
| `team` | 16:9 ou 3:2 | Grupo, natural | Cultura e humanização |

---

## Passo a Passo de Execução

### Passo 1 — Carregar template do nicho
Ler o template JSON do nicho selecionado em `docs/prompts/image-templates/[nicho].json`.

### Passo 2 — Adaptar ao contexto
Selecionar composição, aspect ratio e foco baseado no `[contexto]`.

### Passo 3 — Extrair cores da marca
Ler `src/app/globals.css` e extrair cores primárias e secundárias dos design tokens para injetar no prompt.

### Passo 4 — Montar prompt estruturado
Combinar todos os elementos em um prompt com hierarquia clara:
1. Sujeito principal
2. Ambiente e cenário
3. Iluminação e atmosfera
4. Paleta de cores e mood
5. Estilo artístico e qualidade
6. Parâmetros técnicos (resolução, aspect ratio)

### Passo 5 — Gerar JSON de saída

---

## Formato de Saída

```json
{
  "id": "img-hero-cafe-001",
  "context": "hero",
  "niche": "cafe",
  "prompts": {
    "flux2": {
      "prompt": "Artisan coffee shop interior, warm morning light streaming through large windows, rustic wooden counter with ceramic cups of freshly brewed espresso, latte art visible, steam rising, green plants in background, cozy atmosphere, warm amber and cream tones with terracotta accents, professional food photography, shallow depth of field, 8K quality",
      "negative_prompt": "cartoon, illustration, text, watermark, low quality, blurry, oversaturated",
      "width": 1920,
      "height": 1080,
      "guidance_scale": 7.5,
      "num_inference_steps": 30
    },
    "midjourney": {
      "prompt": "Artisan coffee shop interior, warm morning light streaming through large windows, rustic wooden counter with ceramic cups of freshly brewed espresso, latte art, steam rising, green plants, warm amber and cream tones, terracotta accents, professional food photography, shallow depth of field --ar 16:9 --v 6.1 --style raw --q 2",
      "parameters": {
        "aspect_ratio": "16:9",
        "version": "6.1",
        "style": "raw",
        "quality": 2
      }
    }
  },
  "brand_colors": {
    "primary": "oklch(0.58 0.18 30)",
    "secondary": "oklch(0.65 0.12 90)"
  },
  "specs": {
    "aspect_ratio": "16:9",
    "min_resolution": "1920x1080",
    "format": "webp",
    "usage": "Hero section background image"
  }
}
```

---

## Regras de Qualidade

1. **Sem texto na imagem** — prompts devem explicitamente excluir texto renderizado
2. **Diversidade** — representação diversa em imagens com pessoas
3. **Autenticidade** — evitar imagens genéricas de banco de imagem
4. **Consistência** — manter paleta alinhada com design tokens do projeto
5. **Resolução** — mínimo 1920×1080 para hero, 1024×1024 para product
6. **Formatos de saída** — WebP prioritário, AVIF como alternativa

---

## Saída Esperada

```
✅ Prompt de imagem gerado — [contexto] para [nicho]
├── Prompt Flux 2 otimizado
├── Prompt Midjourney com parâmetros
├── Cores da marca injetadas
├── Aspect ratio: [ratio]
├── Resolução mínima: [WxH]
└── JSON salvo em docs/prompts/generated/[id].json
```

---

## Exemplo de Uso

```
/gen-image hero cafe
/gen-image product ecommerce
/gen-image lifestyle fashion
/gen-image texture portfolio
/gen-image environment restaurante
/gen-image portrait health
/gen-image team tech
```
