---
id: skill-fix-aria-labels
title: "Fix ARIA Labels"
agent: 06-qa-auditor
version: 1.0
category: accessibility
priority: important
requires:
  - skill: skill-audit-a11y
  - rule: 00-constitution
provides:
  - elementos interativos com labels corretos
  - landmarks semânticos em toda página
  - aria-live para conteúdo dinâmico
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Correção de ARIA Labels

## Regra de Ouro

Todo elemento interativo DEVE ter um nome acessível. O nome vem de (em ordem de prioridade):
1. **Conteúdo do texto** — texto dentro do elemento
2. **`<label>`** — via `htmlFor` ou wrapping
3. **`aria-labelledby`** — referência a outro elemento
4. **`aria-label`** — texto direto no atributo

## Labels para Inputs

### Toda Input DEVE ter Label

```tsx
// ❌ Input sem label — leitor de tela não sabe o que é
<input type="email" placeholder="Seu email" />

// ❌ Placeholder não é label — desaparece ao digitar
<input type="email" placeholder="Email" />

// ✅ Label visível com htmlFor
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <input
    id="email"
    type="email"
    placeholder="nome@empresa.com"
    className="w-full rounded-lg border px-4 py-2"
  />
</div>

// ✅ Label como wrapper (alternativa)
<label className="space-y-2">
  <span className="text-sm font-medium">Email</span>
  <input
    type="email"
    placeholder="nome@empresa.com"
    className="w-full rounded-lg border px-4 py-2"
  />
</label>
```

### Instrução e Erro com `aria-describedby`

```tsx
export function PasswordField({ error }: { error?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor="password" className="text-sm font-medium">
        Senha
      </label>
      <input
        id="password"
        type="password"
        aria-describedby={[
          'password-hint',
          error ? 'password-error' : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        className="w-full rounded-lg border px-4 py-2"
      />
      <p id="password-hint" className="text-xs text-muted-foreground">
        Mínimo 8 caracteres, 1 maiúscula, 1 número
      </p>
      {error && (
        <p id="password-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
```

### Grupo de Radio/Checkbox com `fieldset`

```tsx
<fieldset className="space-y-3">
  <legend className="text-sm font-medium">Plano</legend>

  <label className="flex items-center gap-3">
    <input type="radio" name="plan" value="basic" />
    <span>Básico — R$29/mês</span>
  </label>

  <label className="flex items-center gap-3">
    <input type="radio" name="plan" value="pro" />
    <span>Pro — R$79/mês</span>
  </label>

  <label className="flex items-center gap-3">
    <input type="radio" name="plan" value="enterprise" />
    <span>Enterprise — Sob consulta</span>
  </label>
</fieldset>
```

## `aria-label` para Botões de Ícone

```tsx
// ❌ Botão de ícone sem nome acessível
<button>
  <SearchIcon />
</button>
// Leitor de tela anuncia: "botão"

// ✅ aria-label descreve a ação
<button aria-label="Buscar">
  <SearchIcon aria-hidden="true" />
</button>
// Leitor de tela anuncia: "Buscar, botão"

// ✅ Padrão completo com tooltip
<button
  aria-label="Fechar modal"
  title="Fechar modal"
  className="rounded-full p-2 hover:bg-muted"
>
  <XIcon className="size-5" aria-hidden="true" />
</button>
```

### Botões com Ícone + Texto

```tsx
// ✅ Texto já serve como nome acessível — ícone é decorativo
<button className="flex items-center gap-2">
  <PlusIcon className="size-4" aria-hidden="true" />
  <span>Novo projeto</span>
</button>

// ✅ Com badge/contador — aria-label completo
<button aria-label="Notificações, 5 não lidas" className="relative">
  <BellIcon className="size-5" aria-hidden="true" />
  <span
    className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white"
    aria-hidden="true"
  >
    5
  </span>
</button>
```

## `aria-labelledby` para Seções e Modais

```tsx
// Seção identificada pelo seu heading
<section aria-labelledby="features-heading">
  <h2 id="features-heading">Funcionalidades</h2>
  <div className="grid gap-8 md:grid-cols-3">
    {/* ... */}
  </div>
</section>

// Modal com título
<dialog
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
  aria-modal="true"
  className="fixed inset-0 z-50 flex items-center justify-center"
>
  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
    <h2 id="modal-title" className="text-xl font-bold">
      Confirmar exclusão
    </h2>
    <p id="modal-desc" className="mt-2 text-muted-foreground">
      Esta ação não pode ser desfeita. Todos os dados serão
      permanentemente removidos.
    </p>
    <div className="mt-6 flex justify-end gap-3">
      <button onClick={onClose}>Cancelar</button>
      <button onClick={onConfirm} className="bg-destructive text-white">
        Excluir
      </button>
    </div>
  </div>
</dialog>
```

## Landmarks Semânticos

Toda página DEVE ter os landmarks corretos:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Landmark: banner */}
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
          {/* Landmark: navigation */}
          <nav aria-label="Navegação principal" className="mx-auto flex max-w-7xl items-center px-6 py-4">
            <a href="/" aria-label="Ir para página inicial">
              <Logo aria-hidden="true" />
            </a>
            <ul role="list" className="flex gap-6">
              <li><a href="/features">Funcionalidades</a></li>
              <li><a href="/pricing">Preços</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </nav>
        </header>

        {/* Landmark: main */}
        <main id="main-content">
          {children}
        </main>

        {/* Landmark: contentinfo */}
        <footer className="border-t">
          <nav aria-label="Navegação do rodapé">
            {/* Links do footer */}
          </nav>
        </footer>

        {/* Landmark: complementary (se houver sidebar) */}
        <aside aria-label="Conteúdo relacionado">
          {/* Sidebar content */}
        </aside>
      </body>
    </html>
  )
}
```

### Múltiplas `<nav>` — Diferenciar com `aria-label`

```tsx
// ❌ Duas nav sem distinção — leitor de tela não sabe qual é qual
<nav>Menu principal</nav>
<nav>Links do footer</nav>

// ✅ Cada nav com aria-label único
<nav aria-label="Navegação principal">...</nav>
<nav aria-label="Navegação do rodapé">...</nav>
<nav aria-label="Breadcrumb">...</nav>
<nav aria-label="Paginação">...</nav>
```

## `role="status"` e `aria-live` para Conteúdo Dinâmico

### Toast/Notificação

```tsx
export function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 right-4 rounded-lg p-4 shadow-lg',
        type === 'success' && 'bg-green-50 text-green-900',
        type === 'error' && 'bg-red-50 text-red-900'
      )}
    >
      {message}
    </div>
  )
}
```

### Contador em Tempo Real

```tsx
export function CartCount({ count }: { count: number }) {
  return (
    <span aria-live="polite" aria-atomic="true" className="sr-only">
      {count} {count === 1 ? 'item' : 'itens'} no carrinho
    </span>
  )
}
```

### Resultado de Busca

```tsx
export function SearchResults({ results, query }: { results: Result[]; query: string }) {
  return (
    <section aria-labelledby="search-results-heading">
      <h2 id="search-results-heading" className="sr-only">
        Resultados da busca
      </h2>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? 'resultado' : 'resultados'} para "{query}"
      </p>
      <ul role="list">
        {results.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </section>
  )
}
```

### Loading State

```tsx
export function LoadingIndicator({ isLoading }: { isLoading: boolean }) {
  return (
    <div role="status" aria-live="polite">
      {isLoading ? (
        <>
          <Spinner aria-hidden="true" />
          <span className="sr-only">Carregando...</span>
        </>
      ) : (
        <span className="sr-only">Conteúdo carregado</span>
      )}
    </div>
  )
}
```

## Checklist

- [ ] Todo `<input>` tem `<label>` associado (via `htmlFor` ou wrapper)
- [ ] Todo botão de ícone tem `aria-label` descritivo
- [ ] Ícones decorativos têm `aria-hidden="true"`
- [ ] Seções têm `aria-labelledby` apontando para seu heading
- [ ] Modais têm `aria-labelledby` e `aria-describedby`
- [ ] Landmarks presentes: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] Múltiplas `<nav>` diferenciadas com `aria-label`
- [ ] Erros de form com `aria-invalid` e `role="alert"`
- [ ] Conteúdo dinâmico com `aria-live="polite"`
- [ ] Status messages com `role="status"`
- [ ] Grupos de radio/checkbox em `<fieldset>` com `<legend>`
- [ ] `aria-describedby` para instruções e mensagens de erro
