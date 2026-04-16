import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2, LayoutDashboard, ClipboardList, ListChecks,
  Settings, Users, FileText, HardHat, ArrowRight,
  CheckCircle2, MinusCircle, Circle, AlertCircle, Clock,
  Info, Star, Zap, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Styleguide — Design System",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </section>
  );
}

function ColorSwatch({ name, className, value }: { name: string; className: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <div className={cn("h-12 rounded-[--radius-md] border border-border/50", className)} />
      <div>
        <p className="text-xs font-medium text-foreground">{name}</p>
        <p className="text-[10px] text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-[--z-sticky] flex h-14 items-center justify-between border-b border-border bg-background/95 px-8 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded bg-primary">
            <HardHat aria-hidden="true" className="size-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold">Design System</p>
            <p className="text-[10px] text-muted-foreground">Sistema de Incorporação · Olá</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">Ver Login</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">
              Entrar no App
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-10 space-y-12">

        {/* Intent */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Fase 1D — Design System
          </p>
          <h1 className="text-2xl font-bold text-foreground">Incorporação Olá</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Ferramenta interna de gestão de empreendimentos imobiliários. Visual técnico
            inspirado em plantas de engenharia — denso, preciso, orientado a dados.
            Azul cobalto blueprint + terracota amazônica.
          </p>
        </div>

        {/* Navegação rápida */}
        <Section title="Páginas do sistema">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { href: "/login", icon: HardHat, label: "Login", desc: "Autenticação" },
              { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", desc: "9 empreendimentos" },
              { href: "/developments/fit-lago-azul", icon: Building2, label: "Painel Empreendimento", desc: "FIT LAGO AZUL · 22 etapas" },
              { href: "/tasks", icon: ClipboardList, label: "Minhas Tarefas", desc: "Visão pessoal · Lyvia" },
              { href: "/tasks/all", icon: ListChecks, label: "Todas as Tarefas", desc: "Admin/Editor" },
              { href: "/settings/stages", icon: Settings, label: "Etapas & Pesos", desc: "22 etapas · 4 fases" },
              { href: "/settings/users", icon: Users, label: "Usuários", desc: "RBAC · 6 usuários" },
              { href: "/audit", icon: FileText, label: "Auditoria", desc: "Log de alterações" },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-3 rounded-[--radius-md] border border-border bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all duration-[--duration-base] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <Icon aria-hidden="true" className="size-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Separator />

        {/* Tokens de cor */}
        <Section title="Paleta de cores · OKLCH">
          <div>
            <p className="text-xs text-muted-foreground mb-4">
              Domain: incorporação imobiliária · Color world: blueprint (azul cobalto), cimento claro (off-white),
              terracota amazônica (ocre), verde aprovação, vermelho prazo.
            </p>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              <ColorSwatch name="Primary" className="bg-primary" value="oklch(32% 0.09 253)" />
              <ColorSwatch name="Accent" className="bg-accent" value="oklch(55% 0.14 42)" />
              <ColorSwatch name="Background" className="bg-background border" value="oklch(97% 0.008 85)" />
              <ColorSwatch name="Card" className="bg-card border" value="oklch(99.5% 0.004 85)" />
              <ColorSwatch name="Muted" className="bg-muted" value="oklch(94% 0.010 85)" />
              <ColorSwatch name="Border" className="bg-border" value="oklch(84% 0.010 85)" />
              <ColorSwatch name="Success" className="bg-success" value="oklch(40% 0.12 152)" />
              <ColorSwatch name="Warning" className="bg-warning" value="oklch(72% 0.16 85)" />
              <ColorSwatch name="Destructive" className="bg-destructive" value="oklch(52% 0.19 22)" />
              <ColorSwatch name="Chart 1" className="bg-chart-1" value="Blueprint" />
              <ColorSwatch name="Chart 2" className="bg-chart-2" value="Terracota" />
              <ColorSwatch name="Chart 3" className="bg-chart-3" value="Aprovação" />
            </div>
          </div>
        </Section>

        <Separator />

        {/* Tipografia */}
        <Section title="Tipografia · IBM Plex Sans">
          <div className="rounded-[--radius-md] border border-border bg-card p-5 space-y-3">
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Display / h1 — 2.25rem bold</p>
              <h1 className="text-foreground">Gestão de Incorporação</h1>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">h2 — 1.75rem semibold</p>
              <h2 className="text-foreground">FIT LAGO AZUL · Painel</h2>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">h3 — 1.375rem semibold</p>
              <h3 className="text-foreground">Etapas e Pesos</h3>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Body — 0.875rem regular</p>
              <p className="text-sm text-foreground">Protocolar estudo hidrológico na SEMULSP até 15/04/2026. Responsável: Lyvia Vieira.</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Caption — 0.75rem muted</p>
              <p className="text-xs text-muted-foreground">Última atualização: 15/04/2026 · Trilha de auditoria ativa</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Mono / tabular — IBM Plex Mono</p>
              <p className="tabular text-foreground">28.04% · 93.93% · PesoBruto = (2×5 + 5 + 4 + 4) / 5 = 4.60</p>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Botões */}
        <Section title="Botões">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button>Primário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destrutivo</Button>
              <Button variant="accent">Acento</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm"><Plus />Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Star aria-hidden="true" /></Button>
              <Button disabled>Desabilitado</Button>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Badges / Status */}
        <Section title="Badges · Status de etapas">
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium status-finalizado">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Finalizado
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium status-em-andamento">
              <MinusCircle aria-hidden="true" className="size-3" />
              Em andamento
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium status-nao-iniciado">
              <Circle aria-hidden="true" className="size-3" />
              Não iniciado
            </div>
            <Badge variant="destructive"><AlertCircle className="size-3" />2 vencidas</Badge>
            <Badge variant="default">Admin</Badge>
            <Badge variant="warning">Editor</Badge>
            <Badge variant="muted">Visualizador</Badge>
            <Badge variant="secondary">LMC</Badge>
            <Badge variant="accent">Parâmetro alterado</Badge>
          </div>
        </Section>

        <Separator />

        {/* Barra de progresso blueprint */}
        <Section title="Barra de progresso · Assinatura visual">
          <div className="rounded-[--radius-md] border border-border bg-card p-5 space-y-4">
            <p className="text-xs text-muted-foreground">
              Barra segmentada pelas 4 fases macro — assinatura única do produto.
              Cada segmento representa a contribuição proporcional ao % de avanço.
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "REALIZE LARANJEIRAS",
                  total: 93.93,
                  segments: [
                    { value: 17.67, label: "Aq. Terreno", color: "var(--color-chart-1)" },
                    { value: 41.18, label: "Incorporação", color: "var(--color-chart-2)" },
                    { value: 27.46, label: "Lançamento", color: "var(--color-chart-3)" },
                    { value: 7.62, label: "CEF", color: "var(--color-chart-4)" },
                  ],
                },
                {
                  label: "FIT LAGO AZUL",
                  total: 28.04,
                  segments: [
                    { value: 17.67, label: "Aq. Terreno", color: "var(--color-chart-1)" },
                    { value: 10.37, label: "Incorporação", color: "var(--color-chart-2)" },
                    { value: 0, label: "Lançamento", color: "var(--color-chart-3)" },
                    { value: 0, label: "CEF", color: "var(--color-chart-4)" },
                  ],
                },
                {
                  label: "OLÁ PARQUE",
                  total: 17.67,
                  segments: [
                    { value: 17.67, label: "Aq. Terreno", color: "var(--color-chart-1)" },
                    { value: 0, label: "Incorporação", color: "var(--color-chart-2)" },
                    { value: 0, label: "Lançamento", color: "var(--color-chart-3)" },
                    { value: 0, label: "CEF", color: "var(--color-chart-4)" },
                  ],
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                    <span className="tabular text-xs font-bold text-foreground">{item.total.toFixed(2)}%</span>
                  </div>
                  <Progress segments={item.segments} className="h-3" />
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-2 border-t border-border">
              {[
                { label: "Aq. Terreno", color: "var(--color-chart-1)" },
                { label: "Incorporação", color: "var(--color-chart-2)" },
                { label: "Lançamento", color: "var(--color-chart-3)" },
                { label: "CEF", color: "var(--color-chart-4)" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-[1px]" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Separator />

        {/* Cards */}
        <Section title="Cards">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Empreendimento</CardTitle>
                <CardDescription>Card padrão com header e content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  FIT LAGO AZUL · 28.04% · 8 pendências abertas
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/30 bg-destructive/3">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-1.5">
                  <AlertCircle className="size-4" aria-hidden="true" />
                  Atenção
                </CardTitle>
                <CardDescription>Card de estado de erro</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">4 tarefas com prazo vencido</p>
              </CardContent>
            </Card>
            <Card className="border-success/30 bg-success/3">
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Sucesso
                </CardTitle>
                <CardDescription>Card de estado de sucesso</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Etapa finalizada com auditoria registrada</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Separator />

        {/* Skeleton / loading */}
        <Section title="Estados — Loading / Empty / Error">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Loading</p>
              <div className="rounded-[--radius-md] border border-border bg-card p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full mt-3" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Empty</p>
              <div className="rounded-[--radius-md] border border-dashed border-border bg-card p-6 text-center space-y-2">
                <Building2 aria-hidden="true" className="size-8 mx-auto text-muted-foreground/50" strokeWidth={1} />
                <p className="text-xs font-medium text-foreground">Nenhuma tarefa</p>
                <p className="text-[11px] text-muted-foreground">Crie sua primeira tarefa para começar.</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Error</p>
              <div className="rounded-[--radius-md] border border-destructive/30 bg-destructive/5 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <AlertCircle aria-hidden="true" className="size-4 text-destructive" />
                  <p className="text-xs font-medium text-destructive">Erro ao carregar</p>
                </div>
                <p className="text-[11px] text-muted-foreground">Tente novamente ou contate o suporte.</p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">Tentar novamente</Button>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* Tokens de motion / z-index */}
        <Section title="Motion tokens">
          <div className="rounded-[--radius-md] border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { name: "--duration-fast", value: "120ms", desc: "Hover, focus" },
                { name: "--duration-base", value: "220ms", desc: "Transições normais" },
                { name: "--duration-slow", value: "360ms", desc: "Progresso, modais" },
                { name: "--easing-standard", value: "cubic-bezier(0.4,0,0.2,1)", desc: "Padrão" },
              ].map((token) => (
                <div key={token.name} className="space-y-1">
                  <p className="text-[10px] font-mono text-primary">{token.name}</p>
                  <p className="text-xs font-medium text-foreground">{token.value}</p>
                  <p className="text-[10px] text-muted-foreground">{token.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Rodapé */}
        <footer className="text-center space-y-1 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Design System — Incorporação Olá · v1.0.0 · 15/04/2026
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            IBM Plex Sans · OKLCH · Tailwind v4 · Borders-only depth strategy
          </p>
        </footer>
      </main>
    </div>
  );
}

/* Ícone auxiliar inline */
function Plus({ ...props }: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
