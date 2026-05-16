"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NProgress-style top loading bar.
 * Starts immediately on link click, trickles smoothly,
 * then completes when the new page renders.
 */
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }
    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    cleanup();
    setVisible(true);
    setProgress(0);

    // Kick to 15% immediately
    requestAnimationFrame(() => setProgress(15));

    // Trickle: increment by small random amounts every 200ms
    // Slows down as it approaches 90% (never reaches 100 until done)
    trickleRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        // Smaller increments as we get higher
        const increment =
          prev < 30
            ? Math.random() * 8 + 4 // 4-12
            : prev < 60
              ? Math.random() * 4 + 2 // 2-6
              : Math.random() * 2 + 0.5; // 0.5-2.5
        return Math.min(prev + increment, 90);
      });
    }, 200);
  }, [cleanup]);

  const done = useCallback(() => {
    cleanup();
    setProgress(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, [cleanup]);

  // Navigation completed → finish the bar
  useEffect(() => {
    if (visible) {
      done();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept internal link clicks to start the bar immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external links, hash links, mailto, tel, new tabs
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.getAttribute("target") === "_blank"
      ) {
        return;
      }

      // Skip if navigating to the same page
      if (href === pathname) return;

      // Skip if modifier keys are held (open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      start();
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [pathname, start]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2.5px]",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_var(--primary)]"
        style={{
          width: `${progress}%`,
          transition:
            progress === 0
              ? "none"
              : progress === 100
                ? "width 200ms ease-out"
                : "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}
