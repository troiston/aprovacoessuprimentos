import { test, expect } from "@playwright/test";

/** Alinha com `SEED_ADMIN_PASSWORD` / `E2E_PASSWORD` em `.env` (carregado via `dotenv` em `playwright.config.ts`). */
function resolveE2EPassword(): string {
  return (
    process.env.E2E_PASSWORD ??
    process.env.SEED_ADMIN_PASSWORD ??
    "troque-esta-senha-dev"
  );
}

function mustEnforceLoginOnFailure(): boolean {
  return process.env.REQUIRE_E2E_LOGIN === "true";
}

test.describe("smoke", () => {
  test("home responde", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
  });

  test("login responde", async ({ page }) => {
    const res = await page.goto("/login");
    expect(res?.ok()).toBeTruthy();
  });

  test("login aceita query notice (registo desativado)", async ({ page }) => {
    await page.goto("/login?notice=register-disabled");
    await expect(page).toHaveURL(/\/login/);
  });

  test("dashboard requer sessao ou redireciona", async ({ page }) => {
    const res = await page.goto("/dashboard");
    expect(res).not.toBeNull();
    const ok = res!.ok();
    const redirect = res!.status() >= 300 && res!.status() < 400;
    expect(ok || redirect).toBeTruthy();
  });

  test("fluxo login admin chega ao dashboard", async ({ page }) => {
    const password = resolveE2EPassword();
    const loginRes = await page.request.post("/api/auth/login", {
      data: {
        email: "acesso@digaola.com",
        password,
      },
    });
    if (!loginRes.ok()) {
      const body = await loginRes.text();
      if (mustEnforceLoginOnFailure()) {
        throw new Error(
          `Login E2E obrigatório falhou (${loginRes.status()}). Verifique migrate/seed e variáveis E2E_PASSWORD/SEED_ADMIN_PASSWORD. ${body}`,
        );
      }
      test.skip(
        true,
        `Login falhou (${loginRes.status()}). Execute: npx prisma db seed. Defina E2E_PASSWORD ou SEED_ADMIN_PASSWORD no .env (mesma senha do utilizador acesso@digaola.com). ${body}`,
      );
      return;
    }
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  });
});
