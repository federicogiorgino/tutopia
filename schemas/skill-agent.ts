import { z } from "zod";

export const skillAgentFormSchema = z.object({
  kind: z.enum(["agent", "skill"]),
  name: z.string().trim().min(1, "Enter a name."),
  summary: z.string().trim().min(1, "Describe what it does."),
  version: z.string().trim().min(1, "Enter a version."),
  framework: z.string().trim(),
  instructions: z.string().trim().min(1, "Add initial instructions."),
  sourceUrl: z.union([z.literal(""), z.url("Enter a valid URL.")]),
  tags: z.array(z.string().min(1)).max(8),
});
