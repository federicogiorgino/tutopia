import { z } from "zod";

export const codeSnippetFormSchema = z.object({
  title: z.string().trim().min(1, "Enter a title.").max(160),
  description: z
    .string()
    .trim()
    .min(1, "Describe your snippet.")
    .max(500, "Keep the description under 500 characters."),
  snippet: z.object({
    language: z.string().min(1, "Choose a language.").max(64),
    code: z
      .string()
      .max(100_000)
      .refine((code) => code.trim().length > 0, "Enter some code."),
  }),
  tags: z.array(z.string().trim().min(1).max(40)).max(8),
});
