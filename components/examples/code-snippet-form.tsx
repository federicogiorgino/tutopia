"use client";
import {
  FormShell,
  FormSection,
  FormActions,
} from "@/components/ui/form-layout";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { CodeSnippetField } from "@/components/code-snippet-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

export const codeSnippetFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a title."),
  snippet: z.object({
    language: z.string().min(1, "Choose a language."),
    code: z.string().min(1, "Enter some code."),
  }),
});

type Values = z.infer<typeof codeSnippetFormSchema>;

export function CodeSnippetForm() {
  const form = useForm<Values>({
    resolver: zodResolver(codeSnippetFormSchema),
    defaultValues: { title: "", snippet: { language: "javascript", code: "" } },
  });

  const onSubmit = (v: Values) => {
    console.log(v);
  };

  return (
    <FormShell surface="plain" onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection
        title="Create a snippet"
        description="Give your code a name and choose its language."
      >
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Title</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid
                    ? "title-description title-error"
                    : "title-description"
                }
                placeholder="A useful example"
                autoComplete="off"
              />
              <FieldDescription id="title-description">
                Give your snippet a short name.
              </FieldDescription>
              {fieldState.invalid && (
                <FieldError id="title-error" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <CodeSnippetField
          control={form.control}
          name="snippet"
          description="Choose a language for syntax highlighting."
        />
      </FormSection>
      <FormActions>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
          }}
        >
          Reset
        </Button>
        <Button type="submit">Save snippet</Button>
      </FormActions>
    </FormShell>
  );
}
