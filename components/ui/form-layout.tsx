"use client";

import { type ComponentProps, type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

type FormShellProps = ComponentProps<"form"> & {
  width?: "default" | "wide" | "full";
  surface?: "plain" | "card";
};

// Layout parents own spacing. Fields need no outer margins or extra wrappers.
export function FormShell({
  width = "default",
  surface = "plain",
  className,
  ...props
}: FormShellProps) {
  return (
    <form
      data-slot="form-shell"
      className={cn(
        "mx-auto flex w-full min-w-0 flex-col gap-8 [&_[data-slot=field]]:gap-2",
        width === "default" && "max-w-2xl",
        width === "wide" && "max-w-4xl",
        surface === "card" &&
          "rounded-xl border bg-card p-4 text-card-foreground shadow-xs sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

type FormSectionProps = Omit<ComponentProps<"fieldset">, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
};

export function FormSection({
  title,
  description,
  children,
  className,
  ...props
}: FormSectionProps) {
  const descriptionId = useId();
  return (
    <fieldset
      data-slot="form-section"
      aria-describedby={description ? descriptionId : undefined}
      className={cn("min-w-0 space-y-6", className)}
      {...props}
    >
      {title && (
        <legend className="mb-2 p-0 text-base font-semibold tracking-tight">
          {title}
        </legend>
      )}
      {description && (
        <p
          id={descriptionId}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
      )}
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </fieldset>
  );
}

export function FormGrid({
  columns = 2,
  className,
  ...props
}: ComponentProps<"div"> & { columns?: 1 | 2 }) {
  return (
    <div
      data-slot="form-grid"
      className={cn(
        "grid min-w-0 grid-cols-1 items-start gap-6 [&>*]:min-w-0",
        columns === 2 && "md:grid-cols-2",
        className,
      )}
      {...props}
    />
  );
}

// Place secondary actions first and the primary submit action last.
export function FormActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="form-actions"
      className={cn("flex flex-wrap items-center justify-end gap-2", className)}
      {...props}
    />
  );
}
