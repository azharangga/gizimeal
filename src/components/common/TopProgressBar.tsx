import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

/**
 * Slim progress indicator pinned to the top of the viewport.
 * Activates whenever the router is navigating/loading or react-query
 * has any in-flight fetch/mutation.
 */
export function TopProgressBar() {
  const routerLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning || s.status === "pending",
  });
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const active = routerLoading || isFetching > 0 || isMutating > 0;

  // Linger briefly so the bar is visible even on fast transitions.
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (active) {
      setVisible(true);
      return;
    }
    const t = setTimeout(() => setVisible(false), 280);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div
      aria-hidden={!visible}
      className={[
        "pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <div className="h-full w-full bg-primary top-progress-indeterminate" />
    </div>
  );
}