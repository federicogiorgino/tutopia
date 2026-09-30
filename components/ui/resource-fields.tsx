"use client";

import {
  type Control,
  Controller,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPathByValue<T, string>;
  label: string;
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  type?: "text" | "url";
};

export function ResourceTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  multiline,
  type = "text",
}: TextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const descriptionId = `${field.name}-description`;
        const errorId = `${field.name}-error`;
        const common = {
          id: field.name,
          name: field.name,
          value: field.value ?? "",
          onChange: field.onChange,
          onBlur: field.onBlur,
          "aria-invalid": fieldState.invalid,
          "aria-describedby": fieldState.invalid
            ? `${descriptionId} ${errorId}`
            : description
              ? descriptionId
              : undefined,
          placeholder,
        };
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            {multiline ? (
              <textarea
                {...common}
                ref={field.ref}
                rows={5}
                className="min-h-28 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm dark:bg-input/30"
              />
            ) : (
              <Input {...common} ref={field.ref} type={type} />
            )}
            {description && (
              <FieldDescription id={descriptionId}>
                {description}
              </FieldDescription>
            )}
            {fieldState.invalid && (
              <FieldError id={errorId} errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
}

export function ResourceTagsField<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: FieldPathByValue<T, string[]>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TagInput
          id={field.name}
          value={field.value ?? []}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
