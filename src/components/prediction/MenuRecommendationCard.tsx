"use client";

import Link from "next/link";
import { ArrowUpRight, Flame, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreAKGBadge } from "@/components/prediction/ScoreAKGBadge";
import type { MenuRecommendation } from "@/lib/types";
import { slugifyMenu } from "@/lib/predict-store";

export function MenuRecommendationCard({
  menu,
  index,
}: {
  menu: MenuRecommendation;
  index: number;
}) {
  const kcal = menu.nutrients?.["Energy kcal"];
  const slug = slugifyMenu(menu.menu_name);

  return (
    <Link
      href={`/predict/result/menu/${slug}`}
      className="group block h-full focus:outline-none"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Card
        className={[
          "relative flex h-full flex-col overflow-hidden p-5 transition-colors duration-150",
          "hover:border-primary/50 hover:bg-primary/[0.015]",
          menu.is_best
            ? "border-primary/40 bg-primary/[0.02]"
            : "border-border-soft",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {menu.is_best && (
              <span className="mb-2 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                <Star className="h-2.5 w-2.5 fill-primary-foreground" />
                Terbaik
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
              {kcal !== undefined && kcal !== null && kcal !== "" && (
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Flame className="h-3 w-3" /> {kcal} kcal
                </span>
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
