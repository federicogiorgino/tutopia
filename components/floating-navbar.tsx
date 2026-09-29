"use client";

import { FileText, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  NAVBAR_BRAND as brand,
  NAVBAR_HOME_HREF as homeHref,
  NAVBAR_LINK_STYLE as linkStyle,
  NAVBAR_LINKS as links,
  NAVBAR_DESKTOP_QUERY,
  NAVBAR_PRIMARY_ACTION as primaryAction,
  NAVBAR_SECONDARY_ACTION as secondaryAction,
} from "@/constants/navbar";
import { cn } from "@/lib/utils";

export function FloatingNavbar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDismiss = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onFocusOutside = (event: FocusEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia(NAVBAR_DESKTOP_QUERY);
    const resize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("pointerdown", onDismiss);
    document.addEventListener("keydown", onEscape);
    document.addEventListener("focusin", onFocusOutside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("pointerdown", onDismiss);
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("focusin", onFocusOutside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-3 z-40 w-full min-w-0 md:top-5 mb-10"
    >
      <div className="relative rounded-2xl border border-border bg-background/95 shadow-[0_3px_5px_-3px_rgb(0_0_0/0.12),0_12px_24px_-16px_rgb(0_0_0/0.22)] backdrop-blur-xl">
        <div className="flex h-16 items-center gap-2 px-3 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-6">
          <Link
            href={homeHref}
            onClick={() => setOpen(false)}
            className="mr-auto inline-flex min-w-0 items-center gap-2 rounded-lg text-lg font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring md:mr-0 md:justify-self-start md:text-xl"
          >
            <FileText
              aria-hidden="true"
              className="size-5 shrink-0 md:size-6"
              strokeWidth={1.8}
            />
            <span className="truncate">{brand}</span>
          </Link>
          <NavigationMenu
            aria-label="Desktop navigation"
            viewport={false}
            className="hidden md:flex"
          >
            <NavigationMenuList>
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  {link.children?.length ? (
                    <>
                      <NavigationMenuTrigger className="bg-transparent text-muted-foreground">
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="p-2">
                        <ul className="grid w-80 gap-1">
                          {[
                            { label: "Overview", href: link.href },
                            ...link.children,
                          ].map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink
                                asChild
                                active={pathname === child.href}
                              >
                                <Link
                                  href={child.href}
                                  className="block rounded-lg p-3"
                                >
                                  <span className="font-medium">
                                    {child.label}
                                  </span>
                                  {child.description && (
                                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                      {child.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      asChild
                      active={pathname === link.href}
                      className={linkStyle}
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>{" "}
          <div className="flex shrink-0 items-center gap-1 md:justify-self-end md:gap-2">
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-full md:inline-flex"
            >
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
            <Button
              asChild
              className="h-9 rounded-full px-4 text-xs font-semibold md:px-5 md:text-sm"
            >
              <Link href={primaryAction.href} onClick={() => setOpen(false)}>
                {primaryAction.label}
              </Link>
            </Button>
          </div>
          <Button
            ref={triggerRef}
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full md:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((previous) => !previous)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
        {open && (
          <nav
            aria-label="Mobile navigation"
            id={panelId}
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl border bg-background p-2 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links
                .flatMap((link) => [link, ...(link.children ?? [])])
                .map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(linkStyle, "px-4 py-3")}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
            <div className="mt-2 border-t pt-2">
              <Link
                href={secondaryAction.href}
                onClick={() => setOpen(false)}
                className={cn(linkStyle, "block px-4 py-3 text-foreground")}
              >
                {secondaryAction.label}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
