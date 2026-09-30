"use client";

import { Bot, NotebookPen, Terminal } from "lucide-react";

import {
  useResourceModalActions,
  useResourceModalView,
} from "@/hooks/use-resource-modal";
import { cn } from "@/lib/utils";

const kinds = [
  {
    key: "snippet" as const,
    icon: Terminal,
    title: "Snippet",
    desc: "Shareable code with language, tags and a description.",
    accent: "text-snippet border-snippet/40",
  },
  {
    key: "post" as const,
    icon: NotebookPen,
    title: "Post, blog or external link",
    desc: "Write long-form, or share something you found.",
    accent: "text-post border-post/40",
  },
  {
    key: "skill" as const,
    icon: Bot,
    title: "AI skill or agent file",
    desc: "Upload a skill file with version and framework tags.",
    accent: "text-skill border-skill/40",
  },
];

export function MediaTypeSwitcher() {
  const { setView } = useResourceModalActions();
  const view = useResourceModalView();

  if (view !== "select") return null;
  return (
    <div className="grid gap-3">
      {kinds.map((k) => (
        <button
          type="button"
          key={k.key}
          onClick={() => setView(k.key)}
          className={cn(
            "surface-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 py-2 text-left transition-colors hover:border-primary/40",
          )}
        >
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-xl border bg-surface-2",
              k.accent,
            )}
          >
            <k.icon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{k.title}</span>
            <span className="block text-xs text-muted-foreground">
              {k.desc}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
