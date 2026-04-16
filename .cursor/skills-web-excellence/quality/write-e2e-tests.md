---
id: skill-write-e2e-tests
title: "Write E2E Tests"
agent: 06-qa-auditor
version: 1.0
category: quality
priority: important
requires:
  - skill: skill-write-unit-tests
  - rule: 00-constitution
provides:
  - testes E2E com Playwright para fluxos críticos
  - Page Object Model para manutenibilidade
  - integração CI com GitHub Actions
used_by:
  - agent: 06-qa-auditor
  - command: /audit-full
---

# Testes End-to-End

## Setup do Playwright

```bash
npm init playwright@latest
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

## Page Object Model

Encapsular a interação com cada página em uma classe:

```typescript
// e2e/pages/home.page.ts
import { type Page, type Locator, expect } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heroHeading: Locator
  readonly ctaButton: Locator
  readonly featuresSection: Locator
  readonly navLinks: Locator

  constructor(page: Page) {
    this.page = page
    this.heroHeading = page.getByRole('heading', { level: 1 })
    this.ctaButton = page.getByRole('link', { name: /começar|iniciar/i })
    this.featuresSection = page.locator('#features')
    this.navLinks = page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link')
  }

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async expectHeroVisible() {
    await expect(this.heroHeading).toBeVisible()
    await expect(this.ctaButton).toBeVisible()
  }

  async clickCTA() {
    await this.ctaButton.click()
  }

  async scrollToFeatures() {
    await this.featuresSection.scrollIntoViewIfNeeded()
  }
}
```

```typescript
// e2e/pages/contact.page.ts
import { type Page, type Locator, expect } from '@playwright/test'

export class ContactPage {
  readonly page: Page
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly messageInput: Locator
  readonly submitButton: Locator
  readonly successMessage: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.nameInput = page.getByLabel('Nome')
    this.emailInput = page.getByLabel('Email')
    this.messageInput = page.getByLabel('Mensagem')
    this.submitButton = page.getByRole('button', { name: 'Enviar' })
    this.successMessage = page.getByText('Mensagem enviada com sucesso')
    this.errorMessage = page.getByRole('alert')
  }

  async goto() {
    await this.page.goto('/contact')
  }

  async fillForm(data: { name: string; email: string; message: string }) {
    await this.nameInput.fill(data.name)
    await this.emailInput.fill(data.email)
    await this.messageInput.fill(data.message)
  }

  async submit() {
    await this.submitButton.click()
  }

  async expectSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 })
  }

  async expectError(text: string) {
    await expect(this.errorMessage).toContainText(text)
  }
}
```

```typescript
// e2e/pages/auth.page.ts
import { type Page, type Locator, expect } from '@playwright/test'

export class AuthPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly signupLink: Locator
  readonly logoutButton: Locator
  readonly userMenu: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Senha')
    this.loginButton = page.getByRole('button', { name: /entrar|login/i })
    this.signupLink = page.getByRole('link', { name: /criar conta|cadastrar/i })
    this.logoutButton = page.getByRole('button', { name: /sair|logout/i })
    this.userMenu = page.getByRole('button', { name: /menu do usuário/i })
  }

  async gotoLogin() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
    await this.page.waitForURL('**/dashboard')
  }

  async logout() {
    await this.userMenu.click()
    await this.logoutButton.click()
    await this.page.waitForURL('**/login')
  }

  async expectLoggedIn() {
    await expect(this.userMenu).toBeVisible()
  }

  async expectLoggedOut() {
    await expect(this.loginButton).toBeVisible()
  }
}
```

## Testes de Fluxos Críticos

### Navegação

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'

test.describe('Navegação', () => {
  test('menu principal navega para todas as páginas', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    const links = [
      { name: /funcionalidades/i, url: '/features' },
      { name: /preços/i, url: '/pricing' },
      { name: /blog/i, url: '/blog' },
      { name: /contato/i, url: '/contact' },
    ]

    for (const link of links) {
      await page.getByRole('navigation', { name: 'Navegação principal' })
        .getByRole('link', { name: link.name })
        .click()

      await expect(page).toHaveURL(link.url)
      await page.goBack()
    }
  })

  test('logo retorna para home', async ({ page }) => {
    await page.goto('/about')
    await page.getByRole('link', { name: /página inicial/i }).click()
    await expect(page).toHaveURL('/')
  })

  test('links do footer funcionam', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await expect(footer.getByRole('link', { name: /privacidade/i })).toBeVisible()
    await expect(footer.getByRole('link', { name: /termos/i })).toBeVisible()
  })

  test('404 para rotas inexistentes', async ({ page }) => {
    await page.goto('/pagina-que-nao-existe')
    await expect(page.getByText(/não encontrada|404/i)).toBeVisible()
  })
})
```

### Fluxo de Autenticação

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'
import { AuthPage } from './pages/auth.page'

test.describe('Autenticação', () => {
  test('login com credenciais válidas', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.gotoLogin()
    await auth.login('teste@exemplo.com', 'Senha123!')
    await auth.expectLoggedIn()
    await expect(page).toHaveURL('/dashboard')
  })

  test('login com credenciais inválidas mostra erro', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.gotoLogin()

    await auth.emailInput.fill('errado@ex.com')
    await auth.passwordInput.fill('senhaerrada')
    await auth.loginButton.click()

    await expect(page.getByRole('alert')).toContainText(/credenciais inválidas/i)
    await expect(page).toHaveURL('/login')
  })

  test('logout redireciona para login', async ({ page }) => {
    const auth = new AuthPage(page)
    await auth.gotoLogin()
    await auth.login('teste@exemplo.com', 'Senha123!')
    await auth.logout()
    await auth.expectLoggedOut()
  })

  test('acesso a rota protegida sem login redireciona', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
```

### Fluxo de Formulário

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test'
import { ContactPage } from './pages/contact.page'

test.describe('Formulário de Contato', () => {
  test('envia formulário com sucesso', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()

    await contact.fillForm({
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      message: 'Gostaria de saber mais sobre o plano Pro.',
    })

    await contact.submit()
    await contact.expectSuccess()
  })

  test('mostra erro com email inválido', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()

    await contact.fillForm({
      name: 'João',
      email: 'email-invalido',
      message: 'Teste',
    })

    await contact.submit()
    await contact.expectError('email')
  })

  test('campo obrigatório vazio mostra validação', async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goto()
    await contact.submit()

    await expect(contact.nameInput).toHaveAttribute('aria-invalid', 'true')
  })
})
```

### Busca

```typescript
// e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Busca', () => {
  test('busca retorna resultados relevantes', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /buscar/i }).click()
    await page.getByRole('searchbox').fill('Next.js')
    await page.keyboard.press('Enter')

    await expect(page.getByText(/resultado/i)).toBeVisible()
    const results = page.getByRole('listitem')
    await expect(results.first()).toBeVisible()
  })

  test('busca sem resultados mostra mensagem', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /buscar/i }).click()
    await page.getByRole('searchbox').fill('xyzabc123inexistente')
    await page.keyboard.press('Enter')

    await expect(page.getByText(/nenhum resultado/i)).toBeVisible()
  })
})
```

## Visual Regression com Screenshots

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression', () => {
  test('home page visual', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('home page dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    })
  })

  test('mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    })
  })
})
```

## CI com GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npx playwright test --project=chromium
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-screenshots
          path: test-results/
          retention-days: 7
```

## Scripts no package.json

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:update-snapshots": "playwright test --update-snapshots"
  }
}
```

## Checklist

- [ ] Playwright configurado com múltiplos browsers
- [ ] Page Object Model para cada página testada
- [ ] Fluxo de navegação completo testado
- [ ] Fluxo de autenticação (login/signup/logout) testado
- [ ] Formulários testados (sucesso, erro, validação)
- [ ] Busca testada (resultados, sem resultados)
- [ ] Visual regression com screenshots
- [ ] Mobile viewport testado
- [ ] CI configurado no GitHub Actions
- [ ] Artifacts (reports, screenshots) salvos em caso de falha
- [ ] Testes rodam em < 5 minutos no CI
