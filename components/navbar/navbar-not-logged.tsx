"use client";
import { useAuthModalActions } from "@/hooks/use-auth-modal";
import { Button } from "../ui/button";

export function NavbarNotLogged() {
  const { open } = useAuthModalActions();
  return <Button onClick={() => open("login")}>Login</Button>;
}
