"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopProgressBar } from "@/components/common/TopProgressBar";
import { FloatingChat } from "@/components/chatbot/FloatingChat";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  return (
    <AuthProvider>
      <TopProgressBar />
      <div className="flex min-h-screen flex-col">
        {!isAuthRoute && <Navbar />}
        <main className="flex-1">{children}</main>
        {!isAuthRoute && <Footer />}
      </div>
      <Toaster position="top-right" richColors closeButton />
      <FloatingChat />
    </AuthProvider>
  );
}
