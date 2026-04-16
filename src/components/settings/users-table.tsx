"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/generated/prisma/enums";

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  displayName: string | null;
  role: UserRole;
  isActive: boolean;
};

const roleConfig: Record<
  UserRole,
  { label: string; description: string; variant: "default" | "warning" | "muted" }
> = {
  ADMIN: {
    label: "Admin",
    description: "Acesso total: configura etapas, gerencia utilizadores",
    variant: "default",
  },
  EDITOR: {
    label: "Editor",
    description: "Edita estado de etapas e tarefas",
    variant: "warning",
  },
  VIEWER: {
    label: "Leitor",
    description: "Somente leitura",
    variant: "muted",
  },
};

function initialsFromUser(u: UserRow): string {
  const base = u.displayName ?? u.name ?? u.email;
  const parts = base.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const initialsBg = [
  "bg-accent/20 text-accent",
  "bg-primary/20 text-primary",
  "bg-success/20 text-success",
  "bg-warning/20 text-warning",
];

type Props = {
  initialUsers: UserRow[];
};

type InviteSuccess = {
  mailSent: boolean;
  temporaryPassword?: string;
  manualShareHint?: string;
};

export function UsersTable({ initialUsers }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("VIEWER");
  const [inviteSuccess, setInviteSuccess] = useState<InviteSuccess | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  async function patchUser(userId: string, body: Record<string, unknown>) {
    setError(null);
    setPendingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
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
            : "Falha ao atualizar";
        setError(msg);
        return;
      }
      if (
        data &&
        typeof data === "object" &&
        "user" in data &&
        data.user &&
        typeof data.user === "object"
      ) {
        const u = data.user as UserRow;
        setUsers((prev) => prev.map((row) => (row.id === u.id ? { ...row, ...u } : row)));
      }
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  function resetInviteForm() {
    setInviteEmail("");
    setInviteName("");
    setInviteRole("VIEWER");
    setInviteError(null);
    setInviteSuccess(null);
    setCopyDone(false);
  }

  function handleInviteOpenChange(open: boolean) {
    setInviteOpen(open);
    if (!open) {
      resetInviteForm();
    }
  }

  async function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setCopyDone(false);
    setInviteSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          ...(inviteName.trim() ? { name: inviteName.trim() } : {}),
          role: inviteRole,
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao convidar";
        setInviteError(msg);
        return;
      }
      if (
        data &&
        typeof data === "object" &&
        "user" in data &&
        data.user &&
        typeof data.user === "object"
      ) {
        const u = data.user as UserRow;
        setUsers((prev) => [...prev, u].sort((a, b) => a.email.localeCompare(b.email)));
        router.refresh();
      }
      const mailSent =
        data &&
        typeof data === "object" &&
        "mailSent" in data &&
        typeof (data as { mailSent: unknown }).mailSent === "boolean"
          ? (data as { mailSent: boolean }).mailSent
          : false;
      const temporaryPassword =
        data &&
        typeof data === "object" &&
        "temporaryPassword" in data &&
        typeof (data as { temporaryPassword: unknown }).temporaryPassword === "string"
          ? (data as { temporaryPassword: string }).temporaryPassword
          : undefined;
      const manualShareHint =
        data &&
        typeof data === "object" &&
        "manualShareHint" in data &&
        typeof (data as { manualShareHint: unknown }).manualShareHint === "string"
          ? (data as { manualShareHint: string }).manualShareHint
          : undefined;
      setInviteSuccess({
        mailSent,
        ...(temporaryPassword ? { temporaryPassword, manualShareHint } : {}),
      });
    } finally {
      setInviteSubmitting(false);
    }
  }

  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div>
      <Topbar
        title="Utilizadores"
        description={`${activeCount} ativos · ${users.length} total`}
        actions={
          <Button
            size="sm"
            type="button"
            variant="default"
            onClick={() => {
              resetInviteForm();
              setInviteOpen(true);
            }}
          >
            <Plus aria-hidden="true" className="size-4" />
            Convidar utilizador
          </Button>
        }
      />

      <Dialog open={inviteOpen} onOpenChange={handleInviteOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar utilizador</DialogTitle>
            <DialogDescription>
              Cria uma conta com palavra-passe temporária. Se o SMTP estiver configurado, enviamos os
              dados por e-mail; caso contrário, copie a palavra-passe abaixo e partilhe-a de forma
              segura.
            </DialogDescription>
          </DialogHeader>

          {inviteSuccess ? (
            <div className="space-y-4">
              {inviteSuccess.mailSent ? (
                <p className="text-sm text-muted-foreground">
                  Foi enviado um e-mail para <strong className="text-foreground">{inviteEmail}</strong>{" "}
                  com o link de início de sessão e a palavra-passe temporária.
                </p>
              ) : inviteSuccess.temporaryPassword ? (
                <div className="space-y-2">
                  {inviteSuccess.manualShareHint ? (
                    <p className="text-sm text-warning">{inviteSuccess.manualShareHint}</p>
                  ) : null}
                  <Label htmlFor="invite-temp-pw">Palavra-passe temporária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invite-temp-pw"
                      readOnly
                      className="font-mono text-xs"
                      value={inviteSuccess.temporaryPassword}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      aria-label="Copiar palavra-passe temporária"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(inviteSuccess.temporaryPassword ?? "");
                          setCopyDone(true);
                        } catch {
                          setCopyDone(false);
                        }
                      }}
                    >
                      <Copy className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  {copyDone ? (
                    <p className="text-xs text-success">Copiado para a área de transferência.</p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Conta criada com sucesso.</p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => {
                    handleInviteOpenChange(false);
                  }}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              {inviteError ? (
                <p className="text-sm text-destructive border border-destructive/30 rounded-[--radius] px-3 py-2 bg-destructive/5">
                  {inviteError}
                </p>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="invite-email">E-mail</Label>
                <Input
                  id="invite-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={inviteEmail}
                  onChange={(ev) => setInviteEmail(ev.target.value)}
                  disabled={inviteSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-name">Nome (opcional)</Label>
                <Input
                  id="invite-name"
                  autoComplete="name"
                  value={inviteName}
                  onChange={(ev) => setInviteName(ev.target.value)}
                  disabled={inviteSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Perfil</Label>
                <select
                  id="invite-role"
                  className="select-app h-10 w-full max-w-full rounded-[--radius] px-2 text-sm"
                  value={inviteRole}
                  disabled={inviteSubmitting}
                  onChange={(ev) => setInviteRole(ev.target.value as UserRole)}
                >
                  <option value="VIEWER">Leitor</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => handleInviteOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={inviteSubmitting}>
                  {inviteSubmitting ? "A criar…" : "Criar conta"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <main className="p-6 space-y-4">
        {error && (
          <p className="text-sm text-destructive border border-destructive/30 rounded-[--radius] px-3 py-2 bg-destructive/5">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(Object.keys(roleConfig) as UserRole[]).map((key) => {
            const cfg = roleConfig[key];
            return (
              <div
                key={key}
                className="rounded-[--radius-md] border border-border bg-card p-3 space-y-1"
              >
                <Badge variant={cfg.variant} className="text-[10px]">
                  {cfg.label}
                </Badge>
                <p className="text-[11px] text-muted-foreground">{cfg.description}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-[--radius-md] border border-border bg-card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-2.5 pl-4 pr-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Utilizador
                </th>
                <th className="py-2.5 px-3 text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-36">
                  Perfil
                </th>
                <th className="py-2.5 px-3 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground w-28">
                  Estado
                </th>
                <th className="py-2.5 pl-3 pr-4 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Nome de exibição
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => {
                const busy = pendingId === user.id;
                return (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-[--duration-fast]",
                      !user.isActive && "opacity-70",
                    )}
                  >
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-7">
                          <AvatarFallback
                            className={cn(
                              "text-[10px] font-semibold",
                              initialsBg[idx % initialsBg.length],
                            )}
                          >
                            {initialsFromUser(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-tight">
                            {user.displayName ?? user.name ?? "—"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 align-top">
                      <label className="sr-only" htmlFor={`role-${user.id}`}>
                        Perfil de {user.email}
                      </label>
                      <select
                        id={`role-${user.id}`}
                        className="select-app h-9 w-full max-w-[9.5rem] rounded-[--radius] px-2 text-xs"
                        value={user.role}
                        disabled={busy}
                        onChange={(e) => {
                          const role = e.target.value as UserRole;
                          void patchUser(user.id, { role });
                        }}
                      >
                        <option value="VIEWER">Leitor</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 align-middle text-center">
                      <label className="inline-flex items-center justify-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-border accent-primary"
                          checked={user.isActive}
                          disabled={busy}
                          onChange={(e) => {
                            void patchUser(user.id, { isActive: e.target.checked });
                          }}
                        />
                        <span className="text-muted-foreground">{user.isActive ? "Ativo" : "Inativo"}</span>
                      </label>
                    </td>
                    <td className="py-3 pl-3 pr-4 align-top">
                      <div className="flex flex-col gap-1 max-w-xs">
                        <Label htmlFor={`dn-${user.id}`} className="sr-only">
                          Nome de exibição
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`dn-${user.id}`}
                            className="h-9 text-xs shadow-sm bg-card"
                            defaultValue={user.displayName ?? ""}
                            placeholder={user.name ?? user.email}
                            disabled={busy}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v.length === 0 ? null : v;
                              const prev = user.displayName ?? null;
                              if (next === prev) {
                                return;
                              }
                              void patchUser(user.id, { displayName: next });
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
