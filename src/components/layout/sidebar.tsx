"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  ListChecks,
  Settings,
  Users,
  FileText,
  HardHat,
  LogOut,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SidebarUser {
  email: string;
  displayName: string;
  role: string;
}

function roleLabel(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";
    case "EDITOR":
      return "Editor";
    case "VIEWER":
      return "Leitor";
    default:
      return role;
  }
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  /** Evita `/tasks/all` marcar "Minhas Tarefas" (`/tasks`). */
  exactMatch?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/developments", label: "Empreendimentos", icon: Building2 },
  { href: "/tasks", label: "Minhas Tarefas", icon: ClipboardList, exactMatch: true },
  { href: "/tasks/all", label: "Todas as Tarefas", icon: ListChecks, exactMatch: true },
];

function settingsNavForRole(role: string): NavItem[] {
  const base: NavItem[] = [];
  if (role === "ADMIN") {
    base.push(
      { href: "/settings/stages", label: "Etapas e pesos", icon: Settings },
      { href: "/settings/users", label: "Utilizadores", icon: Users },
      { href: "/settings/mail", label: "E-mail (SMTP)", icon: Mail },
    );
  }
  if (role === "EDITOR" || role === "ADMIN") {
    base.push({ href: "/audit", label: "Auditoria", icon: FileText });
  }
  return base;
}

interface SidebarNavItemProps {
  item: NavItem;
  pathname: string;
}

function SidebarNavItem({ item, pathname }: SidebarNavItemProps) {
  const isActive = item.exactMatch
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-2.5 rounded-[--radius] px-2.5 py-2 text-sm font-medium transition-colors duration-[--duration-fast]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isActive
          ? "nav-item-active"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 transition-colors"
        strokeWidth={isActive ? 2 : 1.5}
      />
      {item.label}
    </Link>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

interface SidebarProps {
  user: SidebarUser;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const settingsItems = settingsNavForRole(user.role);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside
      aria-label="Navegação principal"
      className="fixed inset-y-0 left-0 z-[--z-sticky] flex w-56 flex-col border-r border-border bg-background"
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex size-7 items-center justify-center rounded bg-primary">
          <HardHat aria-hidden="true" className="size-4 text-primary-foreground" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-foreground">Incorporação</p>
          <p className="text-[10px] text-muted-foreground tracking-wide uppercase">Diga Olá</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul role="list" className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.href}>
              <SidebarNavItem item={item} pathname={pathname} />
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-3 border-t border-border">
          <p className="px-2.5 pb-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Configurações
          </p>
          <ul role="list" className="space-y-0.5">
            {settingsItems.map((item) => (
              <li key={item.href}>
                <SidebarNavItem item={item} pathname={pathname} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-2.5 rounded-[--radius] px-1.5 py-1.5">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent"
            aria-hidden="true"
          >
            {initials(user.displayName)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-medium text-foreground">{user.displayName}</p>
            <p className="truncate text-[10px] text-muted-foreground">{roleLabel(user.role)}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-center gap-2"
          onClick={() => void handleLogout()}
        >
          <LogOut aria-hidden="true" className="size-3.5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
