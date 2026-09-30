import { NavbarBrand } from "@/components/navbar/navbar-brand";
import { NavbarSearch } from "@/components/navbar/navbar-search";
import { getServerSession } from "@/lib/get-server-session";
import { NavbarLogged } from "./navbar-logged";
import { NavbarNotLogged } from "./navbar-not-logged";

export async function Navbar() {
  const session = await getServerSession();
  // Send only display data to the interactive account menu, never session tokens.
  const user = session
    ? { name: session.user.name, email: session.user.email }
    : null;
  return (
    <header className="dark sticky top-0 z-40 mb-10 w-full min-w-0 border-y border-white/[0.08] bg-[#0b0b0c] text-zinc-100">
      <div className="container mx-auto flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <NavbarBrand />
        <span
          className="mx-1 hidden h-6 w-px bg-white/10 md:block"
          aria-hidden="true"
        />
        <NavbarSearch />
        {user ? <NavbarLogged user={user} /> : <NavbarNotLogged />}
      </div>
    </header>
  );
}
