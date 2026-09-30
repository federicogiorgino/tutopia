"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  FormActions,
  FormSection,
  FormShell,
} from "@/components/ui/form-layout";
import {
  ResourceTagsField,
  ResourceTextField,
} from "@/components/ui/resource-fields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postResourceFormSchema } from "@/schemas/post-resource";
import type { PostResourceFormValues } from "@/types/post-resource";

export function PostResourceForm() {
  const form = useForm<PostResourceFormValues>({
    resolver: zodResolver(postResourceFormSchema),
    defaultValues: {
      kind: "post",
      title: "",
      summary: "",
      body: "",
      url: "",
      tags: [],
    },
  });
  const kind = useWatch({ control: form.control, name: "kind" });
  return (
    <FormShell
      surface="plain"
      onSubmit={form.handleSubmit(() =>
        toast.info(
          "Publishing is not connected yet. Your form is ready to use.",
        ),
      )}
    >
      <FormSection>
        <Controller
          control={form.control}
          name="kind"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-kind">Resource type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="post-kind"
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="link">External link</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <ResourceTextField
          control={form.control}
          name="title"
          label="Title"
          placeholder="A useful title"
        />
        <ResourceTextField
          control={form.control}
          name="summary"
          label="Summary"
          placeholder="What is this about?"
          description="Optional, up to 500 characters."
        />
        {kind === "link" ? (
          <ResourceTextField
            control={form.control}
            name="url"
            label="URL"
            type="url"
            placeholder="https://example.com/article"
          />
        ) : (
          <ResourceTextField
            control={form.control}
            name="body"
            label={kind === "blog" ? "Article" : "Post"}
            multiline
            placeholder="Start writing…"
          />
        )}
        <ResourceTagsField control={form.control} name="tags" />
      </FormSection>
      <FormActions>
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Continue
        </Button>
      </FormActions>
    </FormShell>
  );
}
