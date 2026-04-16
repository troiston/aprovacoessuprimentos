# 14_IMAGE_GENERATION.md — Geração de Imagens no Cursor

> **Skill:** `/asset-generator`  
> **Fase:** 1D (Design System) — após tokens e paleta definidos em `04_DESIGN.md`  
> **Responsável:** Designer  
> **Referência:** Cursor Changelog 2.4 · Modelo: Gemini 2.5 Flash Image

---

## Quando Usar

| Caso de uso | Exemplo | Fase |
|---|---|---|
| Mockups de UI | Preview de telas no styleguide | 1D |
| Empty states | Listas vazias, sem resultados, erro 404 | 1D / 3F |
| Ilustrações de onboarding | Primeiros passos, boas-vindas | 1D |
| Diagramas | Arquitetura, fluxos, conceitos visuais | 2 |
| Assets de produto | Hero images, cards de destaque | 1D |

## Quando NÃO Usar

- Dados, gráficos ou tabelas — usar bibliotecas de visualização (Recharts, Chart.js)
- Fotos de pessoas reais — questões de direitos e consistência
- Logos ou marcas — preferir design manual
- Ícones de UI — usar Lucide (biblioteca padrão do framework)

---

## Checklist Antes de Gerar

- [ ] Paleta de cores definida em `04_DESIGN.md` (seção 1 — Tokens)
- [ ] Estilo visual do produto definido (editorial / tech minimalista / acolhedor / etc.)
- [ ] Diretório de destino criado (`assets/empty-states/`, `assets/diagrams/`, etc.)
- [ ] Nome do arquivo definido seguindo a convenção abaixo

---

## Organização de Assets

```
assets/
├── empty-states/      → empty-[contexto]-[variante].png
├── diagrams/          → diagram-[topico]-[versao].png
├── mockups/           → mockup-[pagina]-[viewport].png
├── illustrations/     → illus-[contexto].png
└── hero/              → hero-[pagina].png
```

**Exemplos de nomes:**
- `empty-tasks-first-access.png`
- `diagram-architecture-v1.png`
- `mockup-dashboard-desktop.png`

---

## Boas Práticas de Prompt

> **Descrições cênicas / narrativas** (94% de coerência) superam **listas de keywords** (61%).

### Estrutura recomendada
```
[Tipo de imagem] para [contexto de uso].
[Descrição da cena ou conceito].
Estilo: [flat / ilustrativo / minimalista / editorial].
Cores: [referência à paleta — ex.: tons neutros com acento em primary-500].
Formato: [1:1 / 16:9 / 4:3].
Sem texto na imagem. [se aplicável]
```

### Exemplo — Empty State
```
Ilustração minimalista para empty state de lista de tarefas.
Uma mesa de escritório vista de cima com caderno aberto em branco e lápis ao lado; luz suave e sombras sutis.
Estilo flat, sem profundidade excessiva.
Cores: tons neutros (off-white, cinza claro) com acento em [cor primária do design system].
Formato 1:1. Sem texto na imagem.
```

### Exemplo — Diagrama de Arquitetura
```
Diagrama de arquitetura de software estilo moderno para documentação técnica.
Caixas com bordas arredondadas conectadas por setas; cores semânticas: azul para frontend, verde para API, cinza para banco de dados.
Fundo claro, tipografia legível, ícones simples e geométricos.
Formato horizontal (16:9). Sem fontes com nome de produto.
```

### Exemplo — Onboarding
```
Ilustração de boas-vindas para tela de onboarding de produto SaaS.
Pessoa em frente a tela com interface organizada; expressão de satisfação discreta.
Estilo editorial minimalista, personagem sem feições detalhadas (forma sobre realismo).
Paleta: [cores do design system]. Formato 4:3.
```

---

## Alinhamento com o Design System

Sempre incluir no prompt:

| Token | Como referenciar no prompt |
|---|---|
| Cor primária | "acento em [valor de --color-primary]" |
| Estilo geral | "coerente com visual [editorial / tech / acolhedor]" |
| Proporção | "formato 1:1 / 16:9 / 4:3 conforme uso" |

---

## Pós-geração — Checklist

- [ ] Asset salvo em `assets/[subdiretório]/` com nome correto
- [ ] Referenciado em `04_DESIGN.md` seção 11 (Assets Gerados)
- [ ] Coerência visual com paleta e estilo conferida
- [ ] Versão alternativa para dark mode gerada (se necessário)

---

## Referências

- `docs/DESIGN_REFERENCES.md` — seção "Geração de imagens"
- `docs/04_DESIGN.md` — tokens e paleta de referência
- Cursor Changelog 2.4 → [cursor.com/changelog/2-4](https://cursor.com/changelog/2-4)
