---
id: skill-write-unit-tests
title: "Write Unit Tests"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: important
requires:
  - rule: 00-constitution
  - rule: 01-typescript
provides:
  - testes unitários com Vitest + Testing Library
  - mocks de API com MSW
  - padrões de teste para componentes React
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Testes Unitários

## Stack de Testes

- **Vitest** — runner rápido, compatível com Jest API
- **@testing-library/react** — testa como o usuário usa
- **@testing-library/user-event** — simula interações reais
- **MSW (Mock Service Worker)** — intercepta requests no nível de rede

## Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitejs/plugin-react jsdom msw
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
```

## Custom Render com Providers

```tsx
// tests/utils.tsx
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/components/theme-provider'

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      {children}
    </ThemeProvider>
  )
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  }
}

export { customRender as render }
export { screen, waitFor, within } from '@testing-library/react'
```

## MSW — Mock de APIs

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Produto A', price: 2990 },
      { id: '2', name: 'Produto B', price: 5990 },
    ])
  }),

  http.post('/api/contact', async ({ request }) => {
    const body = await request.json() as Record<string, string>
    if (!body.email) {
      return HttpResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }
    return HttpResponse.json({ success: true }, { status: 201 })
  }),

  http.get('/api/user', () => {
    return HttpResponse.json({
      id: '1',
      name: 'João Silva',
      email: 'joao@exemplo.com',
    })
  }),
]
```

```typescript
// tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

## Padrão AAA (Arrange-Act-Assert)

Todo teste segue 3 etapas claras:

```typescript
test('incrementa contador ao clicar', async () => {
  // Arrange — preparar o cenário
  const { user } = render(<Counter initialCount={0} />)

  // Act — executar a ação
  await user.click(screen.getByRole('button', { name: /incrementar/i }))

  // Assert — verificar o resultado
  expect(screen.getByText('1')).toBeInTheDocument()
})
```

## Exemplo Completo: Button

```tsx
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner aria-hidden="true" />
          <span className="sr-only">Carregando</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
```

```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen } from '@/tests/utils'
import { Button } from '../button'

describe('Button', () => {
  it('renderiza com texto', () => {
    render(<Button>Salvar</Button>)
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
  })

  it('chama onClick quando clicado', async () => {
    const handleClick = vi.fn()
    const { user } = render(<Button onClick={handleClick}>Enviar</Button>)

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('não chama onClick quando desabilitado', async () => {
    const handleClick = vi.fn()
    const { user } = render(
      <Button disabled onClick={handleClick}>Enviar</Button>
    )

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('mostra loading state', () => {
    render(<Button loading>Salvar</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Carregando')).toBeInTheDocument()
  })

  it('é acessível por teclado', async () => {
    const handleClick = vi.fn()
    const { user } = render(<Button onClick={handleClick}>OK</Button>)

    await user.tab()
    expect(screen.getByRole('button', { name: 'OK' })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

## Exemplo Completo: Formulário

```tsx
// components/contact-form.tsx
'use client'

import { useState } from 'react'
import { Button } from './ui/button'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || 'Erro ao enviar')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  if (status === 'success') {
    return (
      <div role="status">
        <p>Mensagem enviada com sucesso!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" type="text" required />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div>
        <label htmlFor="message">Mensagem</label>
        <textarea id="message" name="message" required />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-destructive">{errorMsg}</p>
      )}

      <Button type="submit" loading={status === 'loading'}>
        Enviar
      </Button>
    </form>
  )
}
```

```typescript
// components/__tests__/contact-form.test.tsx
import { render, screen, waitFor } from '@/tests/utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { ContactForm } from '../contact-form'

describe('ContactForm', () => {
  it('renderiza todos os campos', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mensagem')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument()
  })

  it('envia formulário com sucesso', async () => {
    const { user } = render(<ContactForm />)

    await user.type(screen.getByLabelText('Nome'), 'João Silva')
    await user.type(screen.getByLabelText('Email'), 'joao@exemplo.com')
    await user.type(screen.getByLabelText('Mensagem'), 'Olá, teste!')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    await waitFor(() => {
      expect(screen.getByText('Mensagem enviada com sucesso!')).toBeInTheDocument()
    })
  })

  it('mostra loading durante envio', async () => {
    server.use(
      http.post('/api/contact', async () => {
        await new Promise((r) => setTimeout(r, 100))
        return HttpResponse.json({ success: true })
      })
    )

    const { user } = render(<ContactForm />)

    await user.type(screen.getByLabelText('Nome'), 'João')
    await user.type(screen.getByLabelText('Email'), 'joao@ex.com')
    await user.type(screen.getByLabelText('Mensagem'), 'Teste')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('mostra erro da API', async () => {
    server.use(
      http.post('/api/contact', () => {
        return HttpResponse.json(
          { error: 'Email é obrigatório' },
          { status: 400 }
        )
      })
    )

    const { user } = render(<ContactForm />)

    await user.type(screen.getByLabelText('Nome'), 'João')
    await user.type(screen.getByLabelText('Mensagem'), 'Teste')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email é obrigatório')
    })
  })

  it('mostra erro genérico em falha de rede', async () => {
    server.use(
      http.post('/api/contact', () => {
        return HttpResponse.error()
      })
    )

    const { user } = render(<ContactForm />)

    await user.type(screen.getByLabelText('Nome'), 'João')
    await user.type(screen.getByLabelText('Email'), 'j@e.com')
    await user.type(screen.getByLabelText('Mensagem'), 'T')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
```

## Exemplo Completo: Card com Dados

```typescript
// components/__tests__/product-card.test.tsx
import { render, screen } from '@/tests/utils'
import { ProductCard } from '../product-card'

const mockProduct = {
  id: '1',
  name: 'Produto Premium',
  price: 9990,
  imageUrl: '/product.jpg',
  description: 'Descrição do produto premium',
}

describe('ProductCard', () => {
  it('renderiza informações do produto', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Produto Premium')).toBeInTheDocument()
    expect(screen.getByText('R$ 99,90')).toBeInTheDocument()
    expect(screen.getByText('Descrição do produto premium')).toBeInTheDocument()
  })

  it('imagem tem alt text correto', () => {
    render(<ProductCard product={mockProduct} />)

    const img = screen.getByRole('img', { name: 'Produto Premium' })
    expect(img).toBeInTheDocument()
  })

  it('link aponta para a página do produto', () => {
    render(<ProductCard product={mockProduct} />)

    const link = screen.getByRole('link', { name: /produto premium/i })
    expect(link).toHaveAttribute('href', '/products/1')
  })

  it('formata preço em BRL', () => {
    render(<ProductCard product={{ ...mockProduct, price: 15000 }} />)
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
  })

  it('mostra badge de preço zero como "Grátis"', () => {
    render(<ProductCard product={{ ...mockProduct, price: 0 }} />)
    expect(screen.getByText('Grátis')).toBeInTheDocument()
  })
})
```

## Padrões de Query — Prioridade

```typescript
// Prioridade de queries (do mais acessível ao menos):
// 1. getByRole — como o usuário e leitor de tela veem
screen.getByRole('button', { name: 'Salvar' })
screen.getByRole('heading', { level: 1 })
screen.getByRole('textbox', { name: 'Email' })

// 2. getByLabelText — para form fields
screen.getByLabelText('Senha')

// 3. getByPlaceholderText — segunda opção para inputs
screen.getByPlaceholderText('nome@empresa.com')

// 4. getByText — para conteúdo textual
screen.getByText('Mensagem enviada!')

// 5. getByTestId — último recurso
screen.getByTestId('product-card-1')
```

## Testes Assíncronos

```typescript
// waitFor — espera uma condição ser verdadeira
await waitFor(() => {
  expect(screen.getByText('Carregado')).toBeInTheDocument()
})

// findBy — atalho para waitFor + getBy
const heading = await screen.findByRole('heading', { name: 'Dashboard' })
expect(heading).toBeInTheDocument()

// waitForElementToBeRemoved — espera sumir
await waitForElementToBeRemoved(() => screen.queryByText('Carregando...'))
```

## Checklist

- [ ] Vitest + Testing Library configurados
- [ ] Custom render com todos os Providers
- [ ] MSW configurado para mock de APIs
- [ ] Testes seguem padrão AAA
- [ ] Queries por role/label (não por className/testId)
- [ ] Testes de renderização, interação, estados, erros
- [ ] Testes assíncronos com waitFor
- [ ] Coverage > 80% em statements/branches/functions/lines
- [ ] Testes rodam em < 30s
