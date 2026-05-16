"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreAKGBadge } from "./ScoreAKGBadge";
import type { MenuRecommendation } from "@/lib/types";
import { buildRecipe } from "@/lib/recipe";
import { slugifyMenu } from "@/lib/predict-store";

export function MenuRecommendationCard({
  menu,
  index,
}: {
  menu: MenuRecommendation;
  index: number;
}) {
  const recipe = buildRecipe(menu);
  const kcal = menu.nutrients?.["Energy kcal"];
  const slug = slugifyMenu(menu.menu_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="h-full"
    >
      <Link
        href={`/predict/result/menu/${slug}`}
        className="group block h-full focus:outline-none"
      >
        <Card
          className={[
            "relative flex h-full flex-col overflow-hidden border-border-soft p-5 transition-all duration-300",
            "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_14px_36px_-22px_oklch(0.22_0.015_230/.22)]",
            menu.is_best ? "border-primary/40 bg-primary/[0.02]" : "",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {menu.is_best && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="h-2.5 w-2.5" /> Terbaik
                </span>
              )}
              <h3 className="font-semibold text-base leading-snug text-foreground line-clamp-2">
                {menu.menu_name}
              </h3>
            </div>
            <ScoreAKGBadge score={menu.score_akg} />
          </div>

          {menu.matched_ingredients?.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-1 capitalize">
              {menu.matched_ingredients.join(" · ")}
            </p>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between border-t border-border-soft pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {recipe.duration}
                </span>
                {kcal !== undefined && kcal !== null && kcal !== "" && (
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Flame className="h-3 w-3" /> {kcal} kcal
                  </span>
                )}
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
