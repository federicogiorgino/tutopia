"use client";

import { Bell, Code2, LogOut, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NAVBAR_BRAND,
  NAVBAR_HOME_HREF,
  NAVBAR_RESOURCE_HREF,
  NAVBAR_SEARCH_ITEMS,
} from "@/constants/navbar";
import { authClient } from "@/lib/auth-client";

export function FloatingNavbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const name = session?.user.name || "Account";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const results = NAVBAR_SEARCH_ITEMS.filter((item) =>
    `${item.label} ${item.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  async function signOut() {
    setSigningOut(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
      router.push("/login");
      router.refresh();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="dark sticky top-0 z-40 mb-10 w-full min-w-0 border-y border-white/[0.08] bg-[#0b0b0c] text-zinc-100">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-6  mx-auto container">
        <Link
          href={NAVBAR_HOME_HREF}
          className="flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          <span className="flex size-8 items-center justify-center rounded-[10px] bg-zinc-200 text-zinc-950">
            <Code2 className="size-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            {NAVBAR_BRAND}
          </span>
        </Link>
        <span
          className="mx-1 hidden h-6 w-px bg-white/10 md:block"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden h-9 w-full max-w-96 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-left text-sm text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 md:flex"
        >
          <Search className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Search resources, people, tags...</span>
        </button>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400 md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search aria-hidden="true" />
          </Button>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={isPending}
                aria-label="Account menu"
                className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-[11px] font-semibold outline-none transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50"
              >
                {isPending ? "…" : session ? initials : "?"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="truncate">{session ? name : "Welcome"}</p>
                {session && (
                  <p className="truncate text-xs font-normal text-muted-foreground">
                    {session.user.email}
                  </p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session ? (
                <DropdownMenuItem
                  disabled={signingOut}
                  onSelect={() => void signOut()}
                >
                  <LogOut aria-hidden="true" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {error && (
        <p role="alert" className="px-4 pb-3 text-xs text-red-400">
          {error}
        </p>
      )}
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
    </header>
  );
}
