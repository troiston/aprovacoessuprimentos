"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { MailSmtpMasked } from "@/lib/settings/system-settings.service";

type Props = {
  initial: MailSmtpMasked;
  encryptionReady: boolean;
};

const fieldClass = cn(
  "min-h-11 shadow-sm bg-card text-foreground",
  "border-border hover:border-foreground/25",
);

export function MailSettingsForm({ initial, encryptionReady }: Props) {
  const router = useRouter();
  const [host, setHost] = useState(initial.host);
  const [port, setPort] = useState(String(initial.port || 587));
  const [secure, setSecure] = useState(initial.secure);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [from, setFrom] = useState(initial.from);
  const [testTo, setTestTo] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [configured, setConfigured] = useState(initial.configured);

  useEffect(() => {
    setHost(initial.host);
    setPort(String(initial.port || 587));
    setSecure(initial.secure);
    setFrom(initial.from);
    setConfigured(initial.configured);
  }, [initial.host, initial.port, initial.secure, initial.from, initial.configured]);

  /** Alinhar UI ao que o nodemailer usa: 465 = TLS implícito; 587/25/2525 = STARTTLS (secure desligado). */
  useEffect(() => {
    const p = Number.parseInt(port, 10);
    if (Number.isNaN(p) || p <= 0) {
      return;
    }
    if (p === 465) {
      setSecure(true);
    } else if (p === 587 || p === 2525 || p === 25) {
      setSecure(false);
    }
  }, [port]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        host: host.trim(),
        port: Number(port),
        secure,
        from: from.trim(),
      };
      if (user.trim()) {
        body.user = user.trim();
      }
      if (password.trim()) {
        body.password = password.trim();
      }
      const res = await fetch("/api/settings/mail", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao guardar";
        setSaveError(msg);
        return;
      }
      setSaveMessage("Configuração guardada.");
      setPassword("");
      setConfigured(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleTest(e: React.FormEvent) {
    e.preventDefault();
    setTestMessage(null);
    setTestError(null);
    if (!testTo.trim()) {
      setTestError("Indique o e-mail de destino do teste.");
      return;
    }
    setTesting(true);
    const controller = new AbortController();
    const CLIENT_TEST_TIMEOUT_MS = 32_000;
    const tid = window.setTimeout(() => controller.abort(), CLIENT_TEST_TIMEOUT_MS);
    try {
      const res = await fetch("/api/mail/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testTo.trim() }),
        signal: controller.signal,
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha no teste";
        setTestError(msg);
        return;
      }
      setTestMessage("E-mail de teste enviado.");
    } catch (err) {
      const aborted =
        (err instanceof DOMException && err.name === "AbortError") ||
        (err instanceof Error && err.name === "AbortError");
      if (aborted) {
        setTestError(
          "O pedido ultrapassou 32 segundos (tempo limite). Com porta 465 o servidor espera TLS desde o início — " +
            "a opção «TLS (secure)» deve ficar ligada (é ajustada automaticamente ao mudar a porta). Com 587 mantenha-a desligada (STARTTLS). " +
            "Se o problema continuar, verifique firewall e credenciais.",
        );
        return;
      }
      setTestError("Erro de rede ao contactar o servidor da aplicação.");
    } finally {
      window.clearTimeout(tid);
      setTesting(false);
    }
  }

  const testDisabled = testing || !configured;

  return (
    <div className="max-w-lg space-y-8">
      {!encryptionReady && (
        <p className="text-sm text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-[--radius] px-3 py-2 bg-amber-500/10">
          Defina <code className="text-xs">SETTINGS_ENCRYPTION_KEY</code> no ambiente (32 bytes em hex ou base64)
          para poder guardar credenciais SMTP de forma cifrada.
        </p>
      )}

      <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Servidor SMTP</h2>
        {saveError && (
          <p className="text-sm text-destructive" role="alert">
            {saveError}
          </p>
        )}
        {saveMessage && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
            {saveMessage}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="smtp-host">Host</Label>
            <Input
              id="smtp-host"
              className={fieldClass}
              value={host}
              onChange={(e) => setHost(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="smtp-port">Porta</Label>
            <Input
              id="smtp-port"
              type="number"
              className={cn(fieldClass, "tabular-nums")}
              value={port}
              onChange={(e) => setPort(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2.5 text-sm min-h-11 cursor-pointer rounded border border-transparent px-1 py-2 hover:bg-muted/50">
              <input
                type="checkbox"
                className="size-4 rounded border-border accent-primary"
                checked={secure}
                onChange={(e) => setSecure(e.target.checked)}
              />
              <span>TLS</span>
            </label>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="smtp-user">Utilizador</Label>
            <Input
              id="smtp-user"
              className={fieldClass}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={initial.user ? "Deixe vazio para manter" : ""}
              autoComplete="off"
            />
            {initial.user && (
              <p className="text-[11px] text-muted-foreground">Atual: {initial.user}</p>
            )}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="smtp-pass">Senha</Label>
            <Input
              id="smtp-pass"
              type="password"
              className={fieldClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={initial.passwordSet ? "Deixe vazio para manter" : ""}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="smtp-from">Remetente (From)</Label>
            <Input
              id="smtp-from"
              type="email"
              className={fieldClass}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
            <p className="text-[11px] text-muted-foreground leading-snug">
              Se o remetente for outro e-mail que não o do utilizador SMTP, no campo Senha use a senha de aplicação
              (senha de app) que o fornecedor de correio gera para clientes de correio — não a palavra-passe de início
              de sessão da conta.
            </p>
          </div>
        </div>

        <Button type="submit" disabled={saving || !encryptionReady}>
          {saving ? "A guardar…" : "Guardar"}
        </Button>
      </form>

      <form onSubmit={(e) => void handleTest(e)} className="space-y-3 border-t border-border pt-6">
        <h2 className="text-sm font-semibold text-foreground">Teste de envio</h2>
        {testError && (
          <p className="text-sm text-destructive" role="alert">
            {testError}
          </p>
        )}
        {testMessage && (
          <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
            {testMessage}
          </p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="test-to">Enviar teste para</Label>
          <Input
            id="test-to"
            type="email"
            className={fieldClass}
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            disabled={testDisabled}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={testDisabled}
          aria-disabled={testDisabled}
          title={!configured ? "Guarde primeiro a configuração SMTP." : undefined}
        >
          {testing ? "A enviar…" : "Enviar e-mail de teste"}
        </Button>
      </form>
    </div>
  );
}
