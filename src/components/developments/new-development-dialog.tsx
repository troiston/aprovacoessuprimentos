"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugifyName } from "@/lib/utils/slug";

type NewDevelopmentDialogProps = {
  triggerLabel?: string;
  triggerSize?: "default" | "sm";
  triggerVariant?: "default" | "outline" | "secondary";
};

export function NewDevelopmentDialog({
  triggerLabel = "Novo",
  triggerSize = "sm",
  triggerVariant = "default",
}: NewDevelopmentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const slugPreview = name.trim() ? slugifyName(name.trim()) : "—";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Indique o nome do empreendimento.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/developments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          code: code.trim() ? code.trim() : null,
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
            : "Não foi possível criar o empreendimento.";
        setError(msg);
        return;
      }
      const slug =
        data &&
        typeof data === "object" &&
        "development" in data &&
        typeof (data as { development: { slug?: unknown } }).development === "object" &&
        typeof (data as { development: { slug?: string } }).development?.slug === "string"
          ? (data as { development: { slug: string } }).development.slug
          : null;
      setOpen(false);
      setName("");
      setCode("");
      if (slug) {
        router.push(`/developments/${slug}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={triggerSize} variant={triggerVariant} type="button">
          <Plus aria-hidden="true" className="h-4 w-4 mr-1 shrink-0" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-0">
          <DialogHeader>
            <DialogTitle>Novo empreendimento</DialogTitle>
            <DialogDescription>
              Cria um empreendimento e liga-o ao catálogo de etapas. O URL usa um identificador
              (slug) gerado a partir do nome.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="dev-name">Nome</Label>
              <Input
                id="dev-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Residencial Aurora"
                autoComplete="off"
                required
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dev-code">Código interno (opcional)</Label>
              <Input
                id="dev-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex.: RES-AUR-01"
                maxLength={50}
                disabled={pending}
              />
            </div>

            <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Slug previsto:</span>{" "}
              <span className="font-mono text-foreground">{slugPreview}</span>
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "A criar…" : "Criar empreendimento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
