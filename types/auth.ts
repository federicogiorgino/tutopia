import type { z } from "zod";

import type { auth } from "@/lib/auth";
import type { loginSchema, registerSchema } from "@/schemas/auth";

type RegisterFormValues = z.infer<typeof registerSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

export type { LoginFormValues, RegisterFormValues };
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
