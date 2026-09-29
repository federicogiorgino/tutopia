"use client";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NAVBAR_SEARCH_ITEMS } from "@/constants/navbar";
export function NavbarSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const results = NAVBAR_SEARCH_ITEMS.filter((item) =>
    (item.label + " " + item.description)
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="ml-auto md:ml-0 md:flex-1">
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="hidden h-9 w-full max-w-96 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-left text-sm text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 md:flex"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Search resources, people, tags...</span>
      </button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-zinc-400 md:hidden"
        aria-label="Search"
        onClick={() => setSearchOpen(true)}
      >
        <Search aria-hidden="true" />
      </Button>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Find available pages. Resource, people, and tag search will appear
            here when connected.
          </DialogDescription>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 focus-within:ring-2 focus-within:ring-ring">
            <Search
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <input
              aria-label="Search pages"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              className="h-11 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="space-y-1" aria-live="polite">
            {results.length ? (
              results.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSearchOpen(false)}
                  className="block rounded-lg p-3 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No matching pages.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

