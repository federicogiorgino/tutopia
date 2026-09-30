"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  FormActions,
  FormGrid,
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
import { skillAgentFormSchema } from "@/schemas/skill-agent";
import type { SkillAgentFormValues } from "@/types/skill-agent";

export function SkillAgentForm() {
  const form = useForm<SkillAgentFormValues>({
    resolver: zodResolver(skillAgentFormSchema),
    defaultValues: {
      kind: "skill",
      name: "",
      summary: "",
      version: "0.1.0",
      framework: "",
      instructions: "",
      sourceUrl: "",
      tags: [],
    },
  });
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
              <FieldLabel htmlFor="skill-kind">Resource type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="skill-kind"
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skill">Skill</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <ResourceTextField
          control={form.control}
          name="name"
          label="Name"
          placeholder="Research assistant"
        />
        <ResourceTextField
          control={form.control}
          name="summary"
          label="Summary"
          placeholder="What does it help with?"
        />
        <FormGrid>
          <ResourceTextField
            control={form.control}
            name="version"
            label="Version"
            placeholder="0.1.0"
          />
          <ResourceTextField
            control={form.control}
            name="framework"
            label="Framework"
            placeholder="Optional"
          />
        </FormGrid>
        <ResourceTextField
          control={form.control}
          name="instructions"
          label="Instructions"
          multiline
          placeholder="Describe the behavior, inputs, and expected outputs…"
        />
        <ResourceTextField
          control={form.control}
          name="sourceUrl"
          label="Source URL"
          type="url"
          placeholder="https://github.com/…"
          description="Optional repository or documentation link."
        />
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
