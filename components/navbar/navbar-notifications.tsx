"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
export function NavbarNotifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          title="Notifications"
          className="text-zinc-400 hover:text-zinc-100"
        >
          <Bell aria-hidden="true" className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="font-medium">Notifications</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Notifications aren’t connected yet.
        </p>
      </PopoverContent>
    </Popover>
  );
}

