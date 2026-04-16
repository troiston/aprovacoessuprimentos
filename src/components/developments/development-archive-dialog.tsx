"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

type Props = {
  slug: string;
  name: string;
  triggerVariant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  triggerLabel?: string;
  triggerClassName?: string;
};

export function DevelopmentArchiveDialog({
  slug,
  name,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerLabel = "Arquivar",
  triggerClassName,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/developments/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Falha ao arquivar";
        setError(msg);
        return;
      }
      setOpen(false);
      router.push("/developments");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant={triggerVariant} size={triggerSize} className={triggerClassName}>
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Arquivar empreendimento</DialogTitle>
          <DialogDescription>
            O empreendimento «{name}» será marcado como inativo e deixará de aparecer na lista principal.
            Pode ser revertido na base de dados se necessário.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={() => void handleConfirm()} disabled={pending}>
            {pending ? "A arquivar…" : "Confirmar arquivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
