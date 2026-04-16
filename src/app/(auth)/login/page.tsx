import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HardHat } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o sistema de gestão de incorporação",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Coluna esquerda — formulário */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Marca */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex size-9 items-center justify-center rounded-[--radius-md] bg-primary">
                <HardHat aria-hidden="true" className="size-5 text-primary-foreground" strokeWidth={2} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">Sistema de Incorporação</p>
                <p className="text-xs text-muted-foreground">Diga Olá</p>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais para acessar o sistema.
            </p>
          </div>

          {/* Formulário */}
          <Suspense fallback={<p className="text-sm text-muted-foreground">Carregando…</p>}>
            <LoginForm />
          </Suspense>

          {/* Rodapé */}
          <p className="text-center text-xs text-muted-foreground">
            Problemas de acesso?{" "}
            <Link
              href="#"
              className="text-primary hover:underline underline-offset-4"
            >
              Contate o administrador
            </Link>
          </p>
        </div>
      </div>

      {/* Coluna direita — visual técnico */}
      <div
        aria-hidden="true"
        className="hidden lg:flex lg:flex-1 flex-col items-start justify-between bg-primary p-12 relative overflow-hidden"
      >
        {/* Grid técnico de blueprint */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(oklch(97% 0.006 85) 1px, transparent 1px),
              linear-gradient(90deg, oklch(97% 0.006 85) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
            Gestão de Empreendimentos
          </p>
          <h2 className="text-3xl font-bold text-primary-foreground leading-tight max-w-xs">
            Controle preciso de cada etapa da incorporação.
          </h2>
        </div>

        {/* Stats visuais */}
        <div className="relative z-10 w-full space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Empreendimentos", value: "9" },
              { label: "Etapas ativas", value: "22" },
              { label: "Tarefas abertas", value: "66" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[--radius-md] border border-primary-foreground/20 bg-primary-foreground/10 p-3"
              >
                <p className="text-2xl font-bold text-primary-foreground tabular">{stat.value}</p>
                <p className="text-xs text-primary-foreground/70 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mini barra de progresso blueprint */}
          <div className="rounded-[--radius-md] border border-primary-foreground/20 bg-primary-foreground/10 p-3 space-y-2">
            <p className="text-xs font-medium text-primary-foreground/80">
              Portfólio — Avanço médio
            </p>
            <div className="flex gap-0.5 h-2">
              {[
                { w: "42%", opacity: "opacity-100" },
                { w: "28%", opacity: "opacity-80" },
                { w: "18%", opacity: "opacity-60" },
                { w: "12%", opacity: "opacity-40" },
              ].map((seg, i) => (
                <div
                  key={i}
                  className={`h-full rounded-[1px] bg-primary-foreground ${seg.opacity}`}
                  style={{ width: seg.w }}
                />
              ))}
            </div>
            <p className="text-xs text-primary-foreground/60">4 fases macro · 22 etapas</p>
          </div>

          <p className="text-xs text-primary-foreground/50">
            Acesso restrito a colaboradores da Diga Olá
          </p>
        </div>
      </div>
    </div>
  );
}
