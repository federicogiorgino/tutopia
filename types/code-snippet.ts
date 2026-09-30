import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import type { z } from "zod";

import type { codeSnippetFormSchema } from "@/schemas/code-snippet";

export type CodeSnippetValue = { language: string; code: string };
export type CodeSnippetFormValues = z.infer<typeof codeSnippetFormSchema>;

export type CodeSnippetFieldProps<T extends FieldValues> = {
  name: FieldPathByValue<T, CodeSnippetValue>;
  control: Control<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  defaultLanguage?: string;
  disabled?: boolean;
  expandable?: boolean;
};

export type SavedSnippet = Omit<CodeSnippetFormValues, "snippet"> &
  CodeSnippetValue & {
    id: string;
    createdAt: string;
  };
