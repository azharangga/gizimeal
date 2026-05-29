"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Flame,
  HeartPulse,
  ListChecks,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { SlideInLeft, SlideInRight } from "@/components/common/MotionWrapper";
import { ScoreAKGBadge } from "@/components/prediction/ScoreAKGBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { NUTRIENT_LABELS } from "@/lib/constants";
import { buildRecipe } from "@/lib/recipe";
import { findMenuBySlug, loadPrediction } from "@/lib/predict-store";
import type { MenuRecommendation } from "@/lib/types";

export function MenuPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const [menu, setMenu] = useState<MenuRecommendation | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadPrediction();
    const m = findMenuBySlug(data, slug);
    setMenu(m);
    setHydrated(true);
    if (!m) {
      router.replace("/predict/result");
    }
  }, [slug, router]);

  if (!hydrated || !menu) {
    return <MenuSkeleton />;
  }

  const recipe = buildRecipe(menu);
  const kcal = menu.nutrients?.["Energy kcal"];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 pt-8 pb-12 sm:px-6 md:pt-10 md:pb-14">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <Link href="/predict/result">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Kembali ke hasil
            </Link>
          </Button>

          <div className="mt-5 grid items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                {menu.is_best && (
                  <Badge className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]">
                    <Sparkles className="mr-1 h-3 w-3" /> Rekomendasi Terbaik
                  </Badge>
                )}
                <ScoreAKGBadge score={menu.score_akg} />
              </div>
              <h1 className="mt-4 text-xl font-semibold leading-tight tracking-tight sm:text-2xl md:text-3xl">
                {menu.menu_name}
              </h1>
              {menu.matched_ingredients.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Bahan terdeteksi:{" "}
                  <span className="text-foreground capitalize">
                    {menu.matched_ingredients.join(", ")}
                  </span>
                </p>
              )}
              {menu.explanation && (
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {menu.explanation}
                </p>
              )}
            </div>

            <div className="md:col-span-5">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-soft bg-border-soft">
                <MetaCell icon={<Clock className="h-3.5 w-3.5" />} label="Durasi" value={recipe.duration} />
                <MetaCell icon={<Users className="h-3.5 w-3.5" />} label="Porsi" value={recipe.serving} />
                <MetaCell icon={<ChefHat className="h-3.5 w-3.5" />} label="Tingkat" value={recipe.difficulty} />
                <MetaCell icon={<Flame className="h-3.5 w-3.5" />} label="Kalori" value={kcal !== undefined && kcal !== null && kcal !== "" ? `${kcal} kcal` : "-"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <SlideInLeft className="lg:col-span-4">
              <div className="sticky top-20 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                      <UtensilsCrossed className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                      Bahan-bahan
                    </h2>
                    <Separator className="my-4" />
                    <ul className="space-y-2.5 text-sm">
                      {recipe.ingredients.map((it: string, i: number) => (
                        <motion.li key={it} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, delay: i * 0.03 }} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/40" />
                          <span className="text-foreground/90">{it}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <Sparkles className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                      Tips
                    </h3>
                    <Separator className="my-4" />
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {recipe.tips.map((t: string) => (
                        <li key={t} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/40" />
                          <span className="text-foreground/90">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </SlideInLeft>

            <SlideInRight className="lg:col-span-8 space-y-12">
              <section>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                    <ListChecks className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cara Memasak</p>
                    <h2 className="text-2xl font-semibold">{recipe.steps.length} langkah</h2>
                  </div>
                </div>

                <ol className="mt-6 space-y-3">
                  {recipe.steps.map((s: string, i: number) => (
                    <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="flex gap-4 rounded-lg border border-border bg-card p-5">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-foreground">{i + 1}</span>
                      <p className="pt-1 text-[15px] leading-relaxed text-foreground/90">{s}</p>
                    </motion.li>
                  ))}
                </ol>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informasi Gizi</p>
                    <h2 className="text-2xl font-semibold">Per porsi sajian</h2>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {Object.entries(NUTRIENT_LABELS).map(([key, label]) => {
                    const v = menu.nutrients?.[key];
                    return (
                      <div key={key} className="rounded-lg border border-border bg-card p-4">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="mt-1 text-xl font-semibold">{v !== undefined && v !== null && v !== "" ? v : "-"}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <MedicalDisclaimer />
            </SlideInRight>
          </div>
        </div>
      </section>
    </>
  );
}

function MetaCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-start gap-1 bg-card p-4">
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 pt-8 pb-12 sm:px-6 md:pt-10 md:pb-14">
          {/* Back button */}
          <Skeleton className="h-8 w-32 rounded-md" />

          <div className="mt-5 grid items-center gap-6 md:grid-cols-12">
            <div className="md:col-span-7 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full max-w-xl" />
            </div>
            <div className="md:col-span-5">
              {/* Meta grid skeleton */}
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5 bg-card p-4">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Ingredients card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <Skeleton className="h-5 w-28" />
                <div className="h-px bg-border" />
                <div className="space-y-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              {/* Tips card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <Skeleton className="h-5 w-16" />
                <div className="h-px bg-border" />
                <div className="space-y-2.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            </div>
            {/* Main content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Steps section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4 rounded-lg border border-border bg-card p-5">
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Nutrition section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-32" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
                      <Skeleton className="h-2.5 w-12" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
