import { Code2 } from "lucide-react";
import Link from "next/link";
import { NAVBAR_BRAND, NAVBAR_HOME_HREF } from "@/constants/navbar";
export function NavbarBrand() {
  return (
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
  );
}
