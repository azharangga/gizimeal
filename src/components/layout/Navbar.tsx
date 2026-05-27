"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, Moon, Sun, User } from "lucide-react";
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
import { useAuth } from "@/lib/auth";
import Image from "next/image";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/predict", label: "Deteksi Bahan" },
  { to: "/calculator", label: "Kalkulator Gizi" },
  { to: "/foods", label: "Data Makanan" },
  { to: "/chatbot", label: "Asisten" },
  { to: "/referensi", label: "Referensi" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "Tentang Kami" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
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
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  <User className="mr-2 h-4 w-4" />
                  Kelola Akun
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
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
            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
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
                <button
                  onClick={toggle}
                  className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Sun className="h-4 w-4 dark:hidden" />
                  <Moon className="hidden h-4 w-4 dark:block" />
                  <span className="dark:hidden">Mode Gelap</span>
                  <span className="hidden dark:inline">Mode Terang</span>
                </button>
                {isLoading ? null : isAuthenticated ? (
                  <>
                    <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 py-2 text-sm">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="truncate">{user?.name}</span>
                    </div>
                    <Button variant="outline" className="mt-2" onClick={() => { router.push("/account"); setOpen(false); }}>
                      <User className="mr-2 h-4 w-4" />
                      Kelola Akun
                    </Button>
                    <Button variant="outline" className="mt-2" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    className="mt-3 bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Masuk
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
