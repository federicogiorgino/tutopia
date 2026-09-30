import type { z } from "zod";

import type { postResourceFormSchema } from "@/schemas/post-resource";

export type PostResourceFormValues = z.infer<typeof postResourceFormSchema>;
