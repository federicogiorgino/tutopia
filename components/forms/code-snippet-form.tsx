"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CodeSnippetField } from "@/components/code-snippet-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  FormActions,
  FormSection,
  FormShell,
} from "@/components/ui/form-layout";
import { Input } from "@/components/ui/input";
import {
  ResourceTagsField,
  ResourceTextField,
} from "@/components/ui/resource-fields";

export const codeSnippetFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a title."),
  description: z
    .string()
    .trim()
    .min(1, "Describe your snippet.")
    .max(500, "Keep the description under 500 characters."),
  snippet: z.object({
    language: z.string().min(1, "Choose a language."),
    code: z.string().min(1, "Enter some code."),
  }),
  tags: z.array(z.string().min(1)).max(8),
});

type Values = z.infer<typeof codeSnippetFormSchema>;

export function CodeSnippetForm() {
  const form = useForm<Values>({
    resolver: zodResolver(codeSnippetFormSchema),
    defaultValues: {
      title: "",
      description: "",
      snippet: { language: "javascript", code: "" },
      tags: [],
    },
  });

  const onSubmit = () => {
    toast.info("Publishing is not connected yet. Your form is ready to use.");
  };

  return (
    <FormShell surface="plain" onSubmit={form.handleSubmit(onSubmit)}>
      <FormSection>
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
        <ResourceTextField
          control={form.control}
          name="description"
          label="Description"
          placeholder="What does this snippet do?"
          description="A short explanation to help others use it."
          multiline
        />
        <CodeSnippetField
          control={form.control}
          name="snippet"
          description="Choose a language for syntax highlighting."
          expandable={false}
        />
        <ResourceTagsField control={form.control} name="tags" />
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
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Save snippet
        </Button>
      </FormActions>
    </FormShell>
  );
}
