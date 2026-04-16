import { redirect } from "next/navigation";

/** Complementa `redirects()` em `next.config.ts` e o middleware. */
export default function RegisterPage() {
  redirect("/login?notice=register-disabled");
}
