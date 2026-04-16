# DESIGN_REFERENCES.md — Referências de Inspiração para Design

> **Skills:** `/using-superpowers` `/design` `/frontend-design` `/visual-design-foundations` `/interaction-design`  
> **Fase de uso:** 1D (/design) — consultar antes e durante a criação do design system  
> **Responsável:** Designer  
> **Referência cruzada:** `docs/04_DESIGN.md` (design system), `docs/14_IMAGE_GENERATION.md` (assets)

---

## Consulta Rápida por Necessidade

| Preciso de... | Ir para |
|---|---|
| Inspiração visual de landing pages | Galerias e inspiração visual |
| Componentes React/shadcn prontos | Design systems e componentes |
| Referência de telas de app mobile | Mobile e apps |
| Verificar critérios WCAG AA | Acessibilidade |
| Melhorar microcopy e mensagens de erro | Microcopy e UX writing |
| Referência de dashboard / SaaS | Dashboards e SaaS |
| Evitar design genérico de IA | Anti-padrões e design distinto |
| Animações e micro-interações | Motion e micro-interações |
| Gerar imagens de empty state / mockup | Geração de imagens |
| Issues conhecidas no shadcn/ui | Compatibilidade shadcn |

---

## Galerias e Inspiração Visual

| Site | O que encontrar |
|---|---|
| [21st.dev](https://21st.dev) | Componentes React com código + prompts prontos (GitHub) |
| [lapa.ninja](https://lapa.ninja) | Landing pages reais com URL de cada site |
| [land-book.com](https://land-book.com) | Sites categorizados por indústria, acesso público |
| [minimal.gallery](https://minimal.gallery) | Curadoria diária, sem paywall |
| [siteinspire.com](https://siteinspire.com) | Galeria com filtros, totalmente pública |
| [godly.website](https://godly.website) | Designs SaaS/startup acessíveis sem conta |
| [collectui.com](https://collectui.com) | Padrões de UI diários, open |
| [screenlane.com](https://screenlane.com) | Telas de apps reais, sem login obrigatório |
| [designspells.com](https://designspells.com) | Micro-interações e detalhes de UI |
| [uidatabase.com](https://uidatabase.com) | Biblioteca de padrões com prompts AI embutidos |
| [landingfolio.com](https://www.landingfolio.com) | 4.650+ exemplos de UI; componentes Tailwind/Figma por tipo (CTA, pricing, FAQ) |
| [landingpicks.com](https://www.landingpicks.com) | Diretório curado (SaaS, AI, portfólio), atualizado regularmente |
| [designvault.io](https://designvault.io) | Padrões UX por tipo de tela (home, pricing, sign-up) e elementos |
| [designmunk.com](https://designmunk.com) | Landing pages criativas por indústria |

---

## Design Systems e Componentes (React / shadcn / Tailwind)

| Site / recurso | O que encontrar |
|---|---|
| [awesome-shadcn-ui.com](https://awesome-shadcn-ui.com) | Maior lista curada de recursos shadcn: starters, bibliotecas, kits |
| [shadcn.io templates](https://www.shadcn.io/template/category/ui-kits-&-component-libraries) | Templates oficiais open source por categoria |
| [shadcntemplates.com](https://www.shadcntemplates.com) | Temas com Radix UI (starters, componentes animados, UI kits) |
| [Radix UI](https://www.radix-ui.com) | Primitivas acessíveis (WAI-ARIA, teclado) — base do shadcn/ui |
| [awesome-ui-components (GitHub)](https://github.com/awesomelistsio/awesome-ui-components) | Lista curada: design systems, headless UI, foco em acessibilidade |

---

## Mobile e Apps

| Site | O que encontrar |
|---|---|
| [UIguana](https://uiguana.com) | 7.700+ telas de 24+ apps, fluxos completos (onboarding → checkout) |
| [Mobbin](https://mobbin.com) | 1.150+ apps, 599k+ telas, fluxos em vídeo, filtros por elemento/flow |

---

## Acessibilidade (WCAG e Design)

| Site / recurso | O que encontrar |
|---|---|
| [W3C WCAG Quickref](https://www.w3.org/WAI/WCAG21/quickref/) | Referência oficial WCAG 2.2: critérios, técnicas, filtros por princípio |
| [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist) | Checklist prático em linguagem simplificada |
| [W3C WAI – Design & Develop](https://www.w3.org/WAI/design-develop) | Tutoriais (estrutura, menus, formulários), ARIA Authoring Practices |
| [W3C WAI – Recursos para Designers](https://www.w3.org/WAI/roles/designers/) | Dicas, guias WCAG, acessibilidade cognitiva |
| [WCAG for Designers](https://www.wcag.com/designers/) | 6 considerações: contraste, links, headings, alt text, tab order, erros |

> Referência cruzada: `docs/09_UX_AUDIT.md` — checklist WCAG AA executável por fase

---

## Microcopy e UX Writing

| Site / recurso | O que encontrar |
|---|---|
| [NN/G – UX Copy Sizes](https://www.nngroup.com/articles/ux-copy-sizes/) | Long/short/micro copy; quando usar cada tamanho |
| [PatternFly – About UX writing](https://patternfly.org/ux-writing/about-ux-writing) | Princípios de redação para UI; alinhado a design systems |
| [uStyle – Microcopy](https://ustyle.guide/language/microcopy.html) | Guia: botões, labels, placeholders, tooltips, erros, badges |

> Referência cruzada: `docs/04_DESIGN.md` seção 7 — padrões de microcopy do projeto

---

## Dashboards e SaaS (Referência de Layout)

| Site | O que encontrar |
|---|---|
| [Landingfolio – Components](https://www.landingfolio.com/components) | Componentes de dashboard (métricas, tabelas, gráficos) em Tailwind/Webflow/Figma |
| [DashboardPack](https://dashboardpack.com) | Temas e UI kits de dashboard; referência de estrutura e densidade |

---

## Design Distinto — Evitar "AI Slop"

> **Regra:** evitar Inter/Roboto/Space Grotesk para tudo, gradientes roxo-azul genéricos, layouts de 3 colunas genéricos, paletas tímidas, emojis como ícones.

| Recurso | O que encontrar |
|---|---|
| [Sachin Adlakha – System Prompts That Stop Ugly UIs](https://www.sachinadlakha.us/blog/prompt-engineering-ai-coding-agent) | Blocos `frontend_aesthetics`, `icon_policy`, `no_emoji` — copiar direto para prompts |
| [Managed Code – AI Slop in Design](https://www.managed-code.com/blog-post/ai-slop-in-design) | O que é AI slop; constraints explícitos; design system ownership |
| [Standard Beagle – AI-Generated Interfaces](https://standardbeagle.com/the-year-ai-generated-interfaces-took-over/) | Crítica a interfaces genéricas; o que funcionou para diferenciação |
| [Tech Bytes – Escape AI Slop](https://techbytes.app/posts/escape-ai-slop-frontend-design-guide/) | Guia prático: tipografia, cor, motion, backgrounds |

> Referência cruzada: `docs/04_DESIGN.md` seção 1 — aviso anti-padrões com exemplos do projeto

---

## Motion e Micro-Interações

| Site | O que encontrar |
|---|---|
| [designspells.com](https://designspells.com) | Micro-interações e detalhes de UI reais |
| [collectui.com](https://collectui.com) | Padrões de UI com animações |
| [LottieFiles](https://lottiefiles.com) | Animações JSON (usar com moderação; respeitar `prefers-reduced-motion`) |

> Regra: toda animação deve ter propósito funcional. Ver `docs/04_DESIGN.md` seção 6 (Motion).

---

## Geração de Imagens (Cursor)

| Caso de uso | Referência |
|---|---|
| Mockups de UI, empty states, diagramas | `docs/14_IMAGE_GENERATION.md` — guia completo |
| Onde salvar | `assets/empty-states/`, `assets/diagrams/`, `assets/mockups/` |
| Quando NÃO usar | Dados, gráficos, logos, ícones de UI |

---

## shadcn/ui — Compatibilidade e Issues Conhecidas

| Componente | Problema | Mitigação | Issue |
|---|---|---|---|
| NavigationMenu | Submenus em div compartilhada; animações quebradas com Tailwind v4 | Verificar shadcn v4; CSS-first para animações | [#8320](https://github.com/shadcn-ui/ui/issues/8320), [#6855](https://github.com/shadcn-ui/ui/issues/6855) |
| Sidebar | ENOENT em tailwind.config.ts com v4 | `w-[var(--sidebar-width)]` em vez de `w-[--sidebar-width]` | [#6458](https://github.com/shadcn-ui/ui/issues/6458) |
| Dialog | Interfere com password managers | Testar autofill em fluxos de login | [#9087](https://github.com/shadcn-ui/ui/issues/9087) |
| Tailwind prefix | `gencl:` inserido em tokens | Evitar prefix custom | [#7436](https://github.com/shadcn-ui/ui/issues/7436) |

**shadcn + Tailwind v4:**
```bash
# Projetos novos com Tailwind v4
npx shadcn@canary init
```
Adicionar ao `globals.css` se variáveis CSS não aplicarem:
```css
@config '../tailwind.config.ts';
```
Ver [shadcn Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4).

---

## Uso no Projeto

| Momento | Ação |
|---|---|
| Início da Fase 1D | Consultar Galerias + Anti-padrões antes de abrir `/design` |
| Definindo tokens | Consultar Design Systems + WCAG para contraste |
| Criando microcopy | Consultar seção de Microcopy + `04_DESIGN.md` seção 7 |
| Implementando (Fase 3F) | Consultar issues conhecidas do shadcn antes de usar componente |
| Auditoria UX (Fase 4D) | Consultar WCAG Quickref e cruzar com `09_UX_AUDIT.md` |
