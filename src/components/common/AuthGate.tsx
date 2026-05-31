"use client";

import Link from "next/link";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useCallback, useState } from "react";

/**
 * useAuthGate — gate function + login prompt modal.
 */
export function useAuthGate(options?: { title?: string; description?: string }) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const gate = useCallback((): boolean => {
    if (isAuthenticated) return true;
    setOpen(true);
    return false;
  }, [isAuthenticated]);

  function LoginPrompt() {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <DialogTitle className="mt-3">{options?.title || "Masuk untuk Melanjutkan"}</DialogTitle>
            <DialogDescription>
              {options?.description || "Fitur ini memerlukan akun. Masuk atau daftar gratis untuk menggunakan GiziMeal."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Button asChild className="h-10 w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Masuk
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 w-full">
              <Link href="/register" onClick={() => setOpen(false)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Daftar Gratis
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return { gate, LoginPrompt };
}

/**
 * AuthLockedState — inline placeholder for fully locked pages.
 */
export function AuthLockedState({
  title = "Masuk untuk Menggunakan Fitur Ini",
  description = "Fitur ini memerlukan akun. Masuk atau daftar gratis untuk mulai menggunakan GiziMeal.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border py-16 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild size="sm" className="h-9 px-5">
          <Link href="/login">
            <LogIn className="mr-2 h-3.5 w-3.5" />
            Masuk
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="h-9 px-5">
          <Link href="/register">
            <UserPlus className="mr-2 h-3.5 w-3.5" />
            Daftar Gratis
          </Link>
        </Button>
      </div>
    </div>
  );
}
