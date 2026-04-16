---
id: skill-build-form
title: "Build Form"
agent: 03-builder
version: 1.0
category: components
priority: critical
requires:
  - skill: skill-build-cta
  - rule: 01-typescript
provides:
  - formulários acessíveis com validação Zod e floating labels
used_by:
  - agent: 03-builder
  - command: /new-page
---

# Build Form — Formulários que Convertem e Validam

## Por que Importa

Formulários são o ponto de conversão final. Floating labels economizam **espaço vertical** sem perder contexto. Validação em tempo real reduz abandono em **até 22%**. Cada campo a mais reduz conversão em **~4%** — peça apenas o necessário.

## Padrões Obrigatórios

1. **Floating labels** com CSS puro (`:focus` + `:placeholder-shown`)
2. **Validação visual** em tempo real — borda verde/vermelha
3. **Acessibilidade**: `aria-invalid`, `aria-describedby`, `aria-required`
4. **Zod** para validação runtime em Server Actions
5. **Erros contextuais** abaixo do campo, nunca em toast
6. **Multi-step** com barra de progresso para forms longos (>4 campos)

## Floating Label Field

```tsx
// components/ui/form-field.tsx
"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type ValidationState = "idle" | "valid" | "invalid";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  validation?: ValidationState;
  icon?: ReactNode;
}

const borderByState: Record<ValidationState, string> = {
  idle: "border-border focus:border-primary",
  valid: "border-green-500 focus:border-green-600",
  invalid: "border-red-500 focus:border-red-600",
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, validation = "idle", icon, id, className = "", ...props }, ref) => {
    const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;

    return (
      <div className="relative w-full">
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            placeholder=" "
            aria-invalid={validation === "invalid"}
            aria-describedby={
              [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined
            }
            aria-required={props.required}
            className={[
              "peer w-full rounded-lg border-2 bg-background px-4 pt-5 pb-2",
              "text-foreground transition-colors duration-200",
              "outline-none",
              "placeholder-transparent",
              icon ? "pl-10" : "",
              borderByState[validation],
              className,
            ].join(" ")}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className={[
              "absolute left-4 top-1/2 -translate-y-1/2",
              "text-muted-foreground text-base",
              "transition-all duration-200 ease-out",
              "pointer-events-none origin-left",
              "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75",
              icon ? "left-10" : "",
            ].join(" ")}
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        </div>

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-500">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className="mt-1.5 text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
```

## Zod Schema + Server Action

```tsx
// lib/schemas/contact.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nome precisa de ao menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z
    .string()
    .email("E-mail inválido")
    .min(1, "E-mail é obrigatório"),
  company: z
    .string()
    .min(1, "Empresa é obrigatória"),
  message: z
    .string()
    .min(10, "Mensagem precisa de ao menos 10 caracteres")
    .max(2000, "Mensagem muito longa"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

```tsx
// app/actions/contact.ts
"use server";

import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";

export type FormState = {
  success: boolean;
  errors?: Partial<Record<keyof ContactFormData | "_root", string[]>>;
  message?: string;
};

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as FormState["errors"],
    };
  }

  try {
    // await db.contact.create({ data: result.data });
    return { success: true, message: "Mensagem enviada com sucesso!" };
  } catch {
    return {
      success: false,
      errors: { _root: ["Erro interno. Tente novamente."] },
    };
  }
}
```

## Formulário Completo com Validação em Tempo Real

```tsx
// components/contact-form.tsx
"use client";

import { useActionState, useState, useCallback } from "react";
import { FormField } from "@/components/ui/form-field";
import { CTAButton } from "@/components/ui/cta-button";
import { submitContact, type FormState } from "@/app/actions/contact";
import { contactSchema } from "@/lib/schemas/contact";
import { Mail, User, Building2 } from "lucide-react";

type ValidationMap = Record<string, "idle" | "valid" | "invalid">;

export function ContactForm() {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    submitContact,
    { success: false },
  );
  const [validations, setValidations] = useState<ValidationMap>({});
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((name: string, value: string) => {
    const fieldSchema = contactSchema.shape[name as keyof typeof contactSchema.shape];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value);
    setValidations((v) => ({
      ...v,
      [name]: value === "" ? "idle" : result.success ? "valid" : "invalid",
    }));
    setClientErrors((e) => ({
      ...e,
      [name]: result.success ? "" : result.error.errors[0]?.message ?? "",
    }));
  }, []);

  if (state.success) {
    return (
      <div role="status" className="rounded-xl bg-green-50 p-6 text-center">
        <p className="text-lg font-semibold text-green-800">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {state.errors?._root && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {state.errors._root.join(", ")}
        </div>
      )}

      <FormField
        name="name"
        label="Nome completo"
        required
        icon={<User className="h-4 w-4" />}
        validation={validations.name ?? "idle"}
        error={clientErrors.name || state.errors?.name?.[0]}
        onBlur={(e) => validateField("name", e.target.value)}
      />

      <FormField
        name="email"
        label="E-mail profissional"
        type="email"
        required
        icon={<Mail className="h-4 w-4" />}
        validation={validations.email ?? "idle"}
        error={clientErrors.email || state.errors?.email?.[0]}
        onBlur={(e) => validateField("email", e.target.value)}
      />

      <FormField
        name="company"
        label="Empresa"
        required
        icon={<Building2 className="h-4 w-4" />}
        validation={validations.company ?? "idle"}
        error={clientErrors.company || state.errors?.company?.[0]}
        onBlur={(e) => validateField("company", e.target.value)}
      />

      <div className="relative">
        <textarea
          name="message"
          id="field-message"
          placeholder=" "
          required
          rows={4}
          aria-invalid={validations.message === "invalid"}
          onBlur={(e) => validateField("message", e.target.value)}
          className={[
            "peer w-full rounded-lg border-2 bg-background px-4 pt-5 pb-2",
            "text-foreground transition-colors duration-200 outline-none",
            "placeholder-transparent resize-y min-h-[120px]",
            validations.message === "valid"
              ? "border-green-500"
              : validations.message === "invalid"
                ? "border-red-500"
                : "border-border focus:border-primary",
          ].join(" ")}
        />
        <label
          htmlFor="field-message"
          className={[
            "absolute left-4 top-4 text-muted-foreground text-base",
            "transition-all duration-200 pointer-events-none origin-left",
            "peer-focus:top-1.5 peer-focus:scale-75 peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:scale-75",
          ].join(" ")}
        >
          Mensagem <span className="text-red-500">*</span>
        </label>
        {(clientErrors.message || state.errors?.message?.[0]) && (
          <p role="alert" className="mt-1.5 text-sm text-red-500">
            {clientErrors.message || state.errors?.message?.[0]}
          </p>
        )}
      </div>

      <CTAButton type="submit" size="lg" isLoading={isPending} className="w-full">
        Enviar mensagem
      </CTAButton>
    </form>
  );
}
```

## Multi-Step com Progresso

```tsx
// components/ui/multi-step-form.tsx
"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CTAButton } from "@/components/ui/cta-button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Step {
  title: string;
  content: ReactNode;
  validate?: () => boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: () => void;
}

export function MultiStepForm({ steps, onComplete }: MultiStepFormProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const isLast = current === steps.length - 1;

  function next() {
    const step = steps[current];
    if (step?.validate && !step.validate()) return;
    if (isLast) { onComplete(); return; }
    setDirection(1);
    setCurrent((c) => c + 1);
  }

  function prev() {
    if (current === 0) return;
    setDirection(-1);
    setCurrent((c) => c - 1);
  }

  return (
    <div className="space-y-6">
      {/* Barra de progresso */}
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.title} className="flex-1">
            <div
              className={[
                "h-1.5 rounded-full transition-colors duration-300",
                i <= current ? "bg-primary" : "bg-muted",
              ].join(" ")}
            />
            <p className={[
              "mt-1 text-xs",
              i <= current ? "text-primary font-medium" : "text-muted-foreground",
            ].join(" ")}>
              {step.title}
            </p>
          </div>
        ))}
      </div>

      {/* Conteúdo animado */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25 }}
        >
          {steps[current]?.content}
        </motion.div>
      </AnimatePresence>

      {/* Navegação */}
      <div className="flex gap-3">
        {current > 0 && (
          <CTAButton variant="ghost" onClick={prev} iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Voltar
          </CTAButton>
        )}
        <CTAButton onClick={next} className="ml-auto" iconRight={<ArrowRight className="h-4 w-4" />}>
          {isLast ? "Finalizar" : "Próximo"}
        </CTAButton>
      </div>
    </div>
  );
}
```

## Checklist

- [ ] Floating labels com CSS puro (sem JS para animação do label)
- [ ] `aria-invalid`, `aria-describedby`, `aria-required` em todo campo
- [ ] Validação Zod no servidor (Server Action) — nunca confiar no client
- [ ] Validação visual no `onBlur` — não no `onChange` (irritante)
- [ ] Erro abaixo do campo, com `role="alert"`
- [ ] Max 4-5 campos visíveis; acima disso, multi-step
- [ ] CTA com loading state durante submissão
