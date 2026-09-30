"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAuthModalActions,
  useAuthModalIsOpen,
  useAuthModalView,
} from "@/hooks/use-auth-modal";
import { LoginForm } from "../forms/login-form";
import { RegisterForm } from "../forms/register-form";

export function AuthModal() {
  const isOpen = useAuthModalIsOpen();
  const view = useAuthModalView();
  const { close } = useAuthModalActions();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {view === "login" ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {view === "login"
              ? "Log in to continue."
              : "Sign up to get started."}
          </DialogDescription>
        </DialogHeader>
        {view === "login" ? <LoginForm /> : <RegisterForm />}
      </DialogContent>
    </Dialog>
  );
}
