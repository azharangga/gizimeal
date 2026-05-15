import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { ChatInterface } from "./ChatInterface";

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/chatbot" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            layout
            className={
              fullscreen
                ? "fixed inset-0 z-50"
                : "fixed bottom-4 left-4 right-4 z-50 h-[min(85vh,620px)] sm:left-auto sm:w-[420px] sm:right-6 md:right-8"
            }
          >
            <ChatInterface
              compact={!fullscreen}
              onClose={() => { setOpen(false); setFullscreen(false); }}
              onToggleFullscreen={() => setFullscreen((v) => !v)}
              isFullscreen={fullscreen}
              showControls
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(true)}
            className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-[var(--primary-hover)] sm:right-6 md:bottom-6 md:right-8"
            aria-label="Buka chat"
            whileTap={{ scale: 0.92 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
