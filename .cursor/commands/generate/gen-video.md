---
id: cmd-gen-video
title: Gerar Prompt de Vídeo
version: 2.0
last_updated: 2026-04-07
category: generate
agent: 05-asset-creator
skills:
  - gen-video-prompt
---

# `/gen-video [tipo] [nicho]`

Gera prompts otimizados para geração de vídeos via IA (Runway Gen-3, Sora, Kling). Configura tipo de vídeo, movimento de câmera, duração, e produz JSON estruturado com prompts para cada plataforma.

---

## Parâmetros

| Parâmetro | Obrigatório | Valores Aceitos | Descrição |
|-----------|-------------|-----------------|-----------|
| `tipo` | ✅ Sim | `hero-loop` · `product-reveal` · `lifestyle` · `testimonial` · `demo` | Tipo de vídeo que define duração, movimento e estilo |
| `nicho` | ✅ Sim | `cafe` · `saas` · `ecommerce` · `portfolio` · `restaurante` · `health` · `fashion` · `tech` | Nicho que define cenário, objetos e atmosfera |

---

## Especificação por Tipo de Vídeo

### `hero-loop`
- **Duração:** 4–8 segundos
- **Propósito:** Background animado para hero section, loop seamless
- **Câmera:** Estática ou movimento muito lento (slow zoom, drift)
- **Estilo:** Ambient, hipnótico, sem cortes
- **Formato:** 16:9, muted (sem áudio), autoplay
- **Exportação:** MP4 (H.264) + WebM (VP9) para fallback

### `product-reveal`
- **Duração:** 4–8 segundos
- **Propósito:** Revelação dramática de produto
- **Câmera:** Orbit 360°, slow zoom-in, dolly reveal
- **Estilo:** Fundo limpo, iluminação de estúdio, foco no produto
- **Formato:** 1:1 ou 4:5 (social), 16:9 (web)

### `lifestyle`
- **Duração:** 8–16 segundos
- **Propósito:** Produto em uso, contexto real, conexão emocional
- **Câmera:** Tracking shot, handheld estabilizado, steadicam feel
- **Estilo:** Cinematográfico, shallow DOF, color grading do nicho
- **Formato:** 16:9 (web), 9:16 (stories/reels)

### `testimonial`
- **Duração:** 8–16 segundos
- **Propósito:** Backdrop animado para depoimento em vídeo
- **Câmera:** Estática com leve parallax, bokeh background
- **Estilo:** Fundo desfocado em movimento, ambiente contextual
- **Formato:** 16:9

### `demo`
- **Duração:** 8–16 segundos
- **Propósito:** Demonstração de funcionalidade ou fluxo
- **Câmera:** Screen recording feel, zoom em features, transições suaves
- **Estilo:** Clean, mockup device, interface em destaque
- **Formato:** 16:9 ou 4:3

---

## Templates de Câmera

| Movimento | Descrição | Uso Ideal |
|-----------|-----------|-----------|
| `static` | Câmera fixa, sem movimento | Hero loops simples |
| `slow-zoom-in` | Zoom suave de 1x para 1.1x em 8s | Hero loops, ambientação |
| `slow-zoom-out` | Zoom suave de 1.1x para 1x em 8s | Revelação de ambiente |
| `orbit` | Rotação 360° ao redor do sujeito | Product reveals |
| `dolly-in` | Câmera se aproxima do sujeito | Product reveal, drama |
| `tracking` | Câmera acompanha sujeito em movimento | Lifestyle, demo |
| `crane-up` | Movimento de grua para cima | Establishing shots |
| `parallax` | Layers se movem em velocidades diferentes | Backgrounds texturizados |
| `drift` | Movimento lateral lento e contínuo | Ambientação, hero loops |

---

## Mapeamento Nicho → Cenário de Vídeo

| Nicho | Hero Loop | Product Reveal | Lifestyle |
|-------|-----------|---------------|-----------|
| `cafe` | Vapor subindo de xícara, partículas de café | Xícara girando com latte art | Pessoa tomando café em cafeteria |
| `saas` | Partículas abstratas em gradiente tech | Dashboard com dados animados | Equipe usando o produto em reunião |
| `ecommerce` | Texturas premium, materiais fluindo | Produto girando em pedestal | Pessoa usando produto no dia a dia |
| `portfolio` | Linhas e formas geométricas em movimento | Projeto sendo revelado em tela | Criativo trabalhando em estúdio |
| `restaurante` | Chamas, cortes de ingredientes, prep | Prato sendo finalizado pelo chef | Casal jantando em restaurante |
| `health` | Ondas calmas, partículas orgânicas | Equipamento/produto de saúde | Paciente feliz em consulta |
| `fashion` | Tecidos fluindo, texturas em slow-mo | Peça de roupa em manequim rotativo | Modelo usando a roupa na cidade |
| `tech` | Circuitos, data flow, neon particles | Dispositivo sendo revelado | Desenvolvedor usando ferramenta |

---

## Passo a Passo de Execução

### Passo 1 — Carregar template de vídeo
Ler configuração do tipo de vídeo: duração, câmera padrão, estilo.

### Passo 2 — Adaptar ao nicho
Selecionar cenário, objetos e atmosfera baseados no nicho.

### Passo 3 — Configurar movimento de câmera
Definir movimento conforme tipo de vídeo + personalização.

### Passo 4 — Extrair cores da marca
Ler `globals.css` e incluir paleta no prompt para consistência visual.

### Passo 5 — Gerar JSON de saída

---

## Formato de Saída

```json
{
  "id": "vid-hero-loop-cafe-001",
  "type": "hero-loop",
  "niche": "cafe",
  "prompts": {
    "runway": {
      "prompt": "Slow motion steam rising from a ceramic cup of freshly brewed espresso on a rustic wooden table, warm golden morning light streaming through a window, coffee beans scattered, dust particles floating in light beams, cozy artisan cafe atmosphere, warm amber and cream color palette, cinematic, shallow depth of field",
      "duration": 8,
      "resolution": "1920x1080",
      "aspect_ratio": "16:9",
      "motion": "slow",
      "camera_motion": "slow-zoom-in",
      "style": "cinematic"
    },
    "sora": {
      "prompt": "A seamless looping video of steam slowly rising from an artisan ceramic espresso cup. Rustic wooden table in a cozy cafe. Warm golden morning light from a large window creates beautiful light beams through the steam. Coffee beans scattered on the table. Shallow depth of field, cinematic look, warm amber and cream tones. Camera slowly zooms in over 8 seconds. 4K quality.",
      "duration": "8s",
      "resolution": "1080p",
      "style": "natural"
    },
    "kling": {
      "prompt": "Steam rising from espresso cup, wooden table, warm morning light, cafe atmosphere, cinematic shallow DOF, warm amber tones, slow zoom in",
      "duration": 8,
      "mode": "high_quality",
      "camera_control": "zoom_in",
      "aspect_ratio": "16:9"
    }
  },
  "specs": {
    "duration_seconds": 8,
    "loop": true,
    "audio": false,
    "aspect_ratio": "16:9",
    "min_resolution": "1920x1080",
    "format_primary": "mp4",
    "format_fallback": "webm",
    "codec": "H.264",
    "usage": "Hero section background video, autoplay muted loop"
  },
  "brand_colors": {
    "primary": "oklch(0.58 0.18 30)",
    "secondary": "oklch(0.65 0.12 90)"
  },
  "implementation": {
    "html": "<video autoplay muted loop playsinline poster='/hero-poster.webp'><source src='/hero.mp4' type='video/mp4'><source src='/hero.webm' type='video/webm'></video>",
    "notes": "Usar poster image para LCP. prefers-reduced-motion: pausar vídeo."
  }
}
```

---

## Regras de Qualidade

1. **Loop seamless** — hero-loops devem ter início e fim que conectam suavemente
2. **Sem texto** — excluir explicitamente texto renderizado no prompt
3. **Performance** — vídeos para web devem ser comprimidos (< 5MB para hero loops)
4. **Acessibilidade** — sempre `muted` por padrão, poster image para LCP, respeitar `prefers-reduced-motion`
5. **Consistência** — paleta alinhada com design tokens
6. **Fallback** — sempre gerar poster image estática como fallback

---

## Saída Esperada

```
✅ Prompt de vídeo gerado — [tipo] para [nicho]
├── Prompt Runway Gen-3 com parâmetros
├── Prompt Sora otimizado
├── Prompt Kling com camera_control
├── Duração: [N]s
├── Câmera: [movimento]
├── Aspect ratio: [ratio]
├── Implementação HTML com fallbacks
└── JSON salvo em docs/prompts/generated/[id].json
```

---

## Exemplo de Uso

```
/gen-video hero-loop cafe
/gen-video product-reveal ecommerce
/gen-video lifestyle fashion
/gen-video testimonial health
/gen-video demo saas
```
