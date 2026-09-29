import { NavbarAccount } from "./navbar-account";
import { NavbarCreateButton } from "./navbar-create-button";
import { NavbarNotifications } from "./navbar-notifications";

export function NavbarLogged({
  user,
}: {
  user: { name: string; email: string } | null;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-3">
      <NavbarNotifications />
      <NavbarCreateButton />
      <NavbarAccount user={user} />
    </div>
  );
}
