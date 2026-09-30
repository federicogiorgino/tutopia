import { desc, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { snippets } from "@/drizzle/schemas/snippets";
import { getServerSession } from "@/lib/get-server-session";
import { codeSnippetFormSchema } from "@/schemas/code-snippet";

export async function GET() {
  const session = await getServerSession();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: snippets.id,
      title: snippets.title,
      description: snippets.description,
      language: snippets.language,
      code: snippets.code,
      tags: snippets.tags,
      createdAt: snippets.createdAt,
    })
    .from(snippets)
    .where(eq(snippets.userId, session.user.id))
    .orderBy(desc(snippets.createdAt))
    .limit(50);

  return Response.json(
    { snippets: rows },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = codeSnippetFormSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid snippet", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { title, description, snippet, tags } = parsed.data;
  const [row] = await db
    .insert(snippets)
    .values({
      userId: session.user.id,
      title,
      description,
      language: snippet.language,
      code: snippet.code,
      tags,
    })
    .returning({
      id: snippets.id,
      title: snippets.title,
      description: snippets.description,
      language: snippets.language,
      code: snippets.code,
      tags: snippets.tags,
      createdAt: snippets.createdAt,
    });

  return Response.json({ snippet: row }, { status: 201 });
}
