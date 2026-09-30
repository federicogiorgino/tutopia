"use client";

import { useSnippets } from "@/hooks/use-snippets";

export function SnippetsList({ userId }: { userId: string }) {
  const { data, isPending, error } = useSnippets(userId);

  return (
    <section className="mt-10 space-y-4" aria-labelledby="saved-snippets-title">
      <h2 id="saved-snippets-title" className="text-lg font-semibold">
        Your snippets
      </h2>
      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading snippets…</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      ) : null}
      {data?.length === 0 ? (
        <p className="text-sm text-muted-foreground">No snippets saved yet.</p>
      ) : null}
      {data?.map((snippet) => (
        <article key={snippet.id} className="rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-medium">{snippet.title}</h3>
            <span className="text-xs text-muted-foreground">
              {snippet.language}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {snippet.description}
          </p>
          {snippet.tags.length > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {snippet.tags.join(" · ")}
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
