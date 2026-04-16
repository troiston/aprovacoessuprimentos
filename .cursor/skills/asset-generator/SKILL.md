---
name: asset-generator
description: Fase 3+ VibeCoding — Gera, revisa, otimiza e integra assets visuais ao frontend, alinhados ao design system. Controla formato, performance (LCP/CLS), acessibilidade e mantém biblioteca de prompts vencedores.
---

# Skill: /asset-generator — Assets Visuais (Fase 3+)

## Papel
Visual Asset Coordinator + Frontend Performance Guardian.
Você não gera imagens cegas. Você define o brief, escolhe o formato certo, revisa qualidade, garante acessibilidade, protege LCP/CLS e integra o asset sem degradar a interface.

---

## Pré-condições
Ler antes de qualquer ação:
1. `docs/06_SPECIFICATION.md` — tom visual e público-alvo
2. `docs/07_IMPLEMENTATION.md` — onde o asset será integrado
3. Design system (`tailwind.config.*`, `tokens.*`, `globals.css`)
4. Componente alvo — contexto de uso, dimensões e posição na página

Se o componente alvo não existir, parar e informar bloqueio.

---

## Diagnóstico obrigatório
Declarar no chat antes de gerar:

- **Propósito:** hero / ilustração / ícone / thumbnail / empty state / avatar
- **Posição na página:** above the fold (LCP candidato) ou below the fold
- **Formato correto:** ver tabela abaixo
- **Dimensões e aspect ratio:** ex: 16:9, 1:1, 4:3
- **Prompt base:** texto exato que será usado na geração
- **Sensibilidade de marca:** baixa / média / alta

### Tabela de formatos
| Caso de uso | Formato ideal | Motivo |
|---|---|---|
| Ícones, logos, UI elements | **SVG** | 94% menor que PNG, escalável |
| Hero, thumbnails, fotos | **WebP** | 73% menor que PNG |
| Transparência raster obrigatória | **PNG** | fallback e compatibilidade |
| JPEG | ❌ evitar | usar WebP sempre que possível |

---

## Estratégia de geração

### Cenário A — Placeholder / mockup / exploração
Usar a geração nativa do Cursor com o prompt base declarado.

### Cenário B — Asset final de produção
Não depender apenas do Cursor nativo quando o asset for brand-sensitive, contiver texto, exigir fidelidade alta ou consistência com outros assets.
Nesse caso:
- exportar prompt otimizado
- usar ferramenta/API externa (Midjourney, fal.ai, GPT Image, etc.)
- registrar o prompt vencedor na biblioteca

### Prompt de consistência
Para manter coerência entre múltiplos assets gerados, o prompt deve incluir:
- paleta de cores em HEX
- estilo visual explícito (flat, 3D, minimalista, etc.)
- fundo e composição desejados
- espaço para elementos de UI (evitar fundos busy se houver texto sobreposto)

---

## Revisão obrigatória
Antes de integrar qualquer imagem, validar:

### Qualidade visual
- [ ] sem artefatos, deformações ou texto ilegível
- [ ] composição compatível com o espaço disponível no componente
- [ ] alinhada ao estilo e à paleta do design system
- [ ] consistente com outros assets já integrados

### Qualidade técnica
- [ ] formato correto para o caso de uso
- [ ] dimensões corretas
- [ ] tamanho de arquivo razoável

Se qualquer item falhar → não integrar. Descrever o erro, corrigir o prompt e regenerar.

---

## Integração no frontend

### 1. Arquivo
- salvar em estrutura semântica:
  - `public/assets/heroes/`, `public/assets/illustrations/`, `public/assets/icons/`
- nomear com intenção: `hero-analytics-dashboard.webp`, `empty-state-no-results.webp`
- nunca usar `image-1.png` ou nomes genéricos

### 2. Atributos obrigatórios no código
```html
<!-- imagem informativa -->
<img
  src="hero-analytics.webp"
  alt="Descrição do conteúdo e propósito"
  width="1200"
  height="675"
/>

<!-- imagem decorativa -->
<img src="bg-texture.webp" alt="" aria-hidden="true" />
```

**Regra: nunca omitir `width` e `height`** — evita CLS (layout shift).

### 3. Estratégia de carregamento

| Posição | Estratégia | Motivo |
|---|---|---|
| Above the fold / LCP | `fetchpriority="high"`, sem lazy | Reduz LCP em 200-800ms |
| Below the fold | `loading="lazy"` | Reduz peso inicial |
| Imagem crítica no `<head>` | `<link rel="preload">` | Antecipa fetch antes do render |

### 4. Responsividade
Quando houver múltiplos tamanhos:
```html
<img
  srcset="hero-sm.webp 640w, hero-md.webp 1024w, hero-lg.webp 1440w"
  sizes="100vw"
  src="hero-lg.webp"
  alt="..."
  width="1440"
  height="810"
/>
```

---

## Biblioteca de prompts
Manter registro dos prompts vencedores para reuso e consistência futura.
Salvar em `docs/asset-prompts.md` com:
- nome do asset gerado
- prompt exato usado
- ferramenta/modelo
- data

---

## Restrições
- não integrar asset sem revisar
- não usar nome genérico de arquivo
- não omitir `width` e `height`
- não aplicar lazy-load em imagem acima da dobra
- não usar JPEG ou PNG onde WebP ou SVG resolvem melhor
- não gerar asset de produção sem checar alinhamento com design system

---

## Atualização obrigatória
Atualizar `docs/07_IMPLEMENTATION.md`:
- asset adicionado e componente de uso
- formato escolhido e motivo
- prompt vencedor (ou referência ao `docs/asset-prompts.md`)
- pendências visuais conhecidas

---

## Checklist
- [ ] design system lido
- [ ] componente alvo identificado
- [ ] formato escolhido pela tabela
- [ ] prompt base declarado
- [ ] revisão visual e técnica concluída
- [ ] `width` e `height` definidos
- [ ] estratégia de carregamento correta
- [ ] alt text aplicado
- [ ] arquivo salvo com nome semântico
- [ ] prompt vencedor registrado
- [ ] `docs/07_IMPLEMENTATION.md` atualizado

---

## Próximo passo
Asset aprovado e integrado → `/ux-reviewer` ou `/pr`
