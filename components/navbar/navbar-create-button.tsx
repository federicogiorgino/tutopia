import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { NAVBAR_RESOURCE_HREF } from "@/constants/navbar";
export function NavbarCreateButton() {
  return (
    <Button
      asChild
      className="h-8 gap-2 rounded-lg bg-zinc-200 px-2.5 text-zinc-950 hover:bg-white sm:px-3"
    >
      <Link
        href={NAVBAR_RESOURCE_HREF}
        aria-label="New resource"
        title="New resource"
      >
        <Plus aria-hidden="true" className="size-4" />
        <span className="hidden text-xs font-medium sm:inline">
          New resource
        </span>
      </Link>
    </Button>
  );
}
