"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthModalActions } from "@/hooks/use-auth-modal";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth";
import type { LoginFormValues } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const { setView, close } = useAuthModalActions();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: LoginFormValues) {
    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          close();
          router.refresh();
        },
        onError: (e) => {
          toast.error(
            e?.error?.message ?? "An error occurred while signing in.",
          );
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                autoComplete="email"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </FieldGroup>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 cursor-pointer"
          onClick={() => setView("register")}
        >
          Create an account
        </Button>
      </div>
    </form>
  );
}
