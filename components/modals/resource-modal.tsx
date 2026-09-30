"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useResourceModalActions,
  useResourceModalIsOpen,
  useResourceModalView,
} from "@/hooks/use-resource-modal";
import { cn } from "@/lib/utils";
import type { ResourceModalView } from "@/store/resource-modal";
import { CodeSnippetForm } from "../forms/code-snippet-form";
import { PostResourceForm } from "../forms/post-resource-form";
import { SkillAgentForm } from "../forms/skill-agent-form";
import { MediaTypeSwitcher } from "../media-type-switcher";

const FORMS: Record<ResourceModalView, ReactNode> = {
  select: <MediaTypeSwitcher />,
  snippet: <CodeSnippetForm />,
  post: <PostResourceForm />,
  skill: <SkillAgentForm />,
};

const MODAL_TITLE: Record<ResourceModalView, string> = {
  select: "What do you want to create?",
  snippet: "New snippet",
  post: "New post",
  skill: "New AI skill",
};

const MODAL_DESCRIPTION: Record<ResourceModalView, string> = {
  select: "Choose the type of resource you want to share.",
  snippet: "Share code with a language, tags and a description.",
  post: "Write long-form content or share an external link.",
  skill: "Describe an agent or skill, its instructions, version, and tags.",
};

export function ResourceModal() {
  const isOpen = useResourceModalIsOpen();
  const view = useResourceModalView();
  const { close } = useResourceModalActions();
  const isSelect = view === "select";

  const contentClassname = cn(
    isSelect && "sm:min-w-md",
    !isSelect && "sm:min-w-xl",
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className={cn(contentClassname, "sm:max-h-[90dvh]")}>
        <DialogHeader>
          <DialogTitle>{MODAL_TITLE[view]}</DialogTitle>
          <DialogDescription>{MODAL_DESCRIPTION[view]}</DialogDescription>
        </DialogHeader>
        {FORMS[view]}
      </DialogContent>
    </Dialog>
  );
}
