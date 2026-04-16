"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TopbarNotifications } from "@/components/layout/topbar-notifications";

interface TopbarProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, description, actions }: TopbarProps) {
  return (
    <header className="sticky top-0 z-[--z-sticky] flex h-14 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur-sm">
      <div className="flex-1 min-w-0">
        {title && (
          <div>
            <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
            {description && (
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            )}
          </div>
        )}
        {!title && (
          <div className="relative w-full max-w-sm">
            <Search
              aria-hidden="true"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Buscar empreendimento, tarefa..."
              className="pl-8 h-8 text-xs bg-muted border-transparent focus-visible:bg-card focus-visible:border-border"
              aria-label="Busca global"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actions}
        <TopbarNotifications />
      </div>
    </header>
  );
}
