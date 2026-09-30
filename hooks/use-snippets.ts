"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CodeSnippetFormValues, SavedSnippet } from "@/types/code-snippet";

const snippetsQueryKey = ["snippets"] as const;

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? "Something went wrong.");
  return body as T;
}

export function useSnippets(userId: string) {
  return useQuery({
    queryKey: [...snippetsQueryKey, userId],
    queryFn: async () => {
      const response = await fetch("/api/snippets", { cache: "no-store" });
      return (await readResponse<{ snippets: SavedSnippet[] }>(response))
        .snippets;
    },
  });
}

export function useCreateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: CodeSnippetFormValues) => {
      const response = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      return (await readResponse<{ snippet: SavedSnippet }>(response)).snippet;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: snippetsQueryKey }),
  });
}
