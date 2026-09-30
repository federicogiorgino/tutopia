import type { z } from "zod";

import type { skillAgentFormSchema } from "@/schemas/skill-agent";

export type SkillAgentFormValues = z.infer<typeof skillAgentFormSchema>;
