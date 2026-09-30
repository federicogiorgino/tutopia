export type NavbarLink = { label: string; href: string; description?: string };
export type NavbarItem = NavbarLink & { children?: readonly NavbarLink[] };

export const NAVBAR_BRAND = "Tutopia";
export const NAVBAR_HOME_HREF = "/";
export const NAVBAR_LINKS: readonly NavbarItem[] = [
  { label: "CIAO", href: "/" },
];
export const NAVBAR_SECONDARY_ACTION: NavbarLink = {
  label: "Log in",
  href: "/login",
};
export const NAVBAR_PRIMARY_ACTION: NavbarLink = {
  label: "Get Started",
  href: "/register",
};
export const NAVBAR_DESKTOP_QUERY = "(min-width: 768px)";
export const NAVBAR_LINK_STYLE =
  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
export const NAVBAR_RESOURCE_HREF = "/create";
export const NAVBAR_SEARCH_ITEMS = [
  {
    label: "Code snippet",
    href: NAVBAR_RESOURCE_HREF,
    description: "Create and format a code snippet.",
  },
];
