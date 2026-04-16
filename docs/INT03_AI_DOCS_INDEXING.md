# 19_AI_DOCS_INDEXING.md — Indexação de Docs para IA

> **Status:** OPCIONAL  
> **Referência:** [arkologystudio/trail-docs](https://github.com/arkologystudio/trail-docs)  
> **Usar quando:** 15+ docs ou contexto de tokens muito alto por sessão

---

## Quando Usar

| Situação | Recomendado? |
|---|---|
| < 10 documentos, projeto novo | ❌ Não — desnecessário |
| 10–15 docs, sessões focadas | ⚠️ Opcional — avaliar custo/benefício |
| 15+ docs, agentes consumindo muitos tokens | ✅ Sim |
| Necessidade de retrieval com citações exatas | ✅ Sim |
| Trabalho com múltiplos agentes em paralelo | ✅ Sim |

## Quando NÃO Usar

- Projetos em fase inicial (< Fase 2)
- Equipes pequenas com contexto de sessão curto
- Quando `@docs/DOCS_INDEX.md` já resolve a navegação

---

## trail-docs

CLI que indexa markdown para retrieval com citações — sem LLM na indexação.

### Benefícios Mensuráveis

| Comparação | Redução de tokens | Impacto |
|---|---|---|
| vs Context7 | −83% | Menos tokens por query |
| vs grep | −52.7% | Mais preciso |
| Compreensão | +18.4% | (DEV.to benchmark) |

### Instalação

```bash
npm install -g trail-docs
```

### Comandos

| Comando | Uso |
|---|---|
| `trail-docs find "termo"` | Localizar seções relevantes em `docs/` |
| `trail-docs extract "âncora"` | Extrair conteúdo com citações exatas |
| `trail-docs expand "âncora"` | Inspecionar vizinhança da âncora |

---

## Configuração Recomendada

### Script de Indexação

```bash
# scripts/trail-docs-index.sh
#!/bin/bash
set -euo pipefail

echo "🔍 Indexando docs/ com trail-docs..."
trail-docs index ./docs --output .trail-docs-index.json

echo "✅ Índice gerado em .trail-docs-index.json"
echo "Use: trail-docs find 'termo' para buscar"
```

```bash
chmod +x scripts/trail-docs-index.sh
bash scripts/trail-docs-index.sh
```

### .cursorignore (garantir que docs/ está indexável)

```
# NÃO adicionar docs/ aqui — deve ser indexado pelo Cursor e trail-docs
node_modules/
.next/
dist/
.trail-docs-index.json  # índice gerado automaticamente
```

---

## Integração com o Workflow VibeCoding

### Como usar no contexto de um agente

```text
# Ao invés de: @docs/03_SPECIFICATION.md @docs/02_PRD.md @docs/04_DESIGN.md

# Usar trail-docs para recuperar só o que for relevante:
trail-docs find "contratos de API"
trail-docs find "critérios de aceite"

# E incluir apenas os resultados no prompt
```

### Fases em que trail-docs agrega mais valor

| Fase | Uso recomendado |
|---|---|
| Fase 3B / 3F — Implementação | Buscar contratos específicos da SPEC sem carregar o doc inteiro |
| Fase 4 — Quality | Buscar critérios de aceite para cruzar com testes |
| Hotfix | Localizar a seção relevante do runbook rapidamente |

---

## Manutenção

- Re-indexar após cada fase concluída: `bash scripts/trail-docs-index.sh`
- Adicionar ao script de CI/CD como step opcional (pré-deploy)
- O arquivo `.trail-docs-index.json` não deve ser commitado (adicionar ao `.gitignore`)
