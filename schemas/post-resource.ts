import { z } from "zod";

export const postResourceFormSchema = z
  .object({
    kind: z.enum(["post", "blog", "link"]),
    title: z.string().trim().min(1, "Enter a title."),
    summary: z
      .string()
      .trim()
      .max(500, "Keep the summary under 500 characters."),
    body: z.string(),
    url: z.string(),
    tags: z.array(z.string().min(1)).max(8),
  })
  .superRefine((data, context) => {
    if (data.kind === "link") {
      if (!z.url().safeParse(data.url).success)
        context.addIssue({
          code: "custom",
          path: ["url"],
          message: "Enter a valid URL.",
        });
    } else if (!data.body.trim())
      context.addIssue({
        code: "custom",
        path: ["body"],
        message: "Write some content.",
      });
  });
