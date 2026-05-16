"use client";

import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "mx-auto text-center" : "";
  return (
    <header className={`relative max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-semibold text-[28px] leading-[1.1] tracking-tight sm:text-[34px] md:text-[44px]"
      >
        {title}
      </motion.h1>
      {lead && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:text-base"
        >
          {lead}
        </motion.p>
      )}
    </header>
  );
}
