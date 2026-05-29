"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, Moon, Sun, User, History } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import Image from "next/image";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/about", label: "Tentang Kami" },
  { to: "/predict", label: "Deteksi" },
  { to: "/calculator", label: "Kalkulator" },
  { to: "/foods", label: "Tabel Gizi" },
  { to: "/referensi", label: "Referensi" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
    toast.success("Berhasil keluar", { description: "Sampai jumpa lagi." });
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={logo} alt="GiziMeal" className="h-8 w-auto rounded-md object-contain dark:brightness-0 dark:invert" height={32} width={100} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`relative rounded-md px-3 py-1.5 text-[13px] tracking-wide text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground ${isActive(l.to) ? "bg-primary/10 text-primary font-semibold" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={toggle}
            aria-label="Toggle tema"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>
          {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-secondary/60" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Menu profil">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    Kelola Akun
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    Riwayat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]">
              <Link href="/login">
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                Masuk
              </Link>
            </Button>
          )}
        </div>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Buka menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              <div className="mt-6 flex flex-1 flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground ${isActive(l.to) ? "bg-primary/10 text-primary font-semibold" : ""}`}
                  >
                    {l.label}
                  </Link>
                ))}

                {isLoading ? null : isAuthenticated ? (
                  <div className="mt-4 border-t border-border pt-4">
                    {/* User info */}
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-foreground">
                            {user?.name?.charAt(0).toUpperCase() ?? "U"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{user?.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    {/* Account links */}
                    <div className="mt-1 flex flex-col gap-0.5">
                      <Link
                        href="/account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <User className="h-4 w-4" />
                        Kelola Akun
                      </Link>
                      <Link
                        href="/history"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <History className="h-4 w-4" />
                        Riwayat
                      </Link>
                      <button
                        onClick={() => { setOpen(false); setShowLogoutDialog(true); }}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="mt-4 bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Masuk
                    </Link>
                  </Button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Theme toggle — pinned to bottom */}
                <div className="border-t border-border pt-3 pb-2">
                  <button
                    onClick={toggle}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Sun className="h-4 w-4 dark:hidden" />
                      <Moon className="hidden h-4 w-4 dark:block" />
                      <span className="dark:hidden">Mode Gelap</span>
                      <span className="hidden dark:inline">Mode Terang</span>
                    </span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Keluar dari akun?</DialogTitle>
            <DialogDescription>
              Kamu akan keluar dari akun. Riwayat deteksi tetap tersimpan dan bisa diakses kembali setelah masuk.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowLogoutDialog(false)}>
              Batal
            </Button>
            <Button
              size="sm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleLogout}
            >
              Ya, Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
