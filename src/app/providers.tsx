"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { TopProgressBar } from "@/components/common/TopProgressBar";
import { FloatingChat } from "@/components/chatbot/FloatingChat";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <TopProgressBar />
      </Suspense>
      {children}
      <Toaster position="top-right" richColors closeButton />
      <FloatingChat />
    </AuthProvider>
  );
}
