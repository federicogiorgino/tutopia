"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useResourceModalActions } from "@/hooks/use-resource-modal";

export function NavbarCreateButton() {
  const { open } = useResourceModalActions();
  return (
    <Button
      onClick={() => open("select")}
      className="h-8 gap-2 rounded-lg bg-zinc-200 px-2.5 text-zinc-950 hover:bg-white sm:px-3"
    >
      <Plus aria-hidden="true" className="size-4" />
      <span className="hidden text-xs font-medium sm:inline">New resource</span>
    </Button>
  );
}
