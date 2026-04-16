import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { getCurrentUser } from "@/lib/auth/get-session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        user={{
          email: user.email,
          displayName: user.displayName ?? user.name ?? user.email,
          role: user.role,
        }}
      />
      <div className="flex-1 pl-56 min-w-0">{children}</div>
    </div>
  );
}
