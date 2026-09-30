"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useCreateSnippet } from "@/hooks/use-snippets";
import { codeSnippetFormSchema } from "@/schemas/code-snippet";
import type { CodeSnippetFormValues } from "@/types/code-snippet";

export function CodeSnippetForm({
  onCreated,
}: {
  onCreated?: () => void;
} = {}) {
  const createSnippet = useCreateSnippet();
  const form = useForm<CodeSnippetFormValues>({
    resolver: zodResolver(codeSnippetFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      snippet: { language: "javascript", code: "" },
      tags: [],
    },
  });

  const onSubmit = async (values: CodeSnippetFormValues) => {
    try {
      await createSnippet.mutateAsync(values);
      toast.success("Snippet saved.");
      form.reset();
      onCreated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save snippet.",
      );
    }
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
          disabled={
            !form.formState.isValid ||
            form.formState.isSubmitting ||
            createSnippet.isPending
          }
        >
          {createSnippet.isPending ? "Saving…" : "Save snippet"}
        </Button>
      </FormActions>
    </FormShell>
  );
}
