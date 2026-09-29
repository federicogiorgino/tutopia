import type { z } from "zod";

import type { loginSchema, registerSchema } from "@/schemas/auth";

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export type { LoginFormValues, RegisterFormValues };
