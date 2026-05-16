"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { FadeUp } from "@/components/common/MotionWrapper";
import { MenuRecommendationCard } from "@/components/prediction/MenuRecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { loadPrediction } from "@/lib/predict-store";
import type { PredictionResponse } from "@/lib/types";

function pct(n?: number) {
  return Math.max(0, Math.min(100, Math.round((n ?? 0) * 100)));
}

function ConfidenceRing({ value }: { value: number }) {
  const v = pct(value);
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (v / 100) * circ;
  const tone =
    v >= 75 ? "text-primary" : v >= 50 ? "text-clay" : "text-destructive";
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-border"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className={`fill-none ${tone}`}
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-semibold">{v}%</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          akurasi
        </span>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ResultSkeleton() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 pt-8 pb-10 sm:px-6 md:pt-14 md:pb-16">
          <Skeleton className="h-5 w-32" />
          <div className="mt-4 grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="md:col-span-5">
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 md:py-16">
          <Skeleton className="h-6 w-48" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const d = loadPrediction();
    setData(d);
    setHydrated(true);
    if (!d) {
      router.replace("/predict");
    }
  }, [router]);

  if (!hydrated || !data) {
    return <ResultSkeleton />;
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 pt-8 pb-10 sm:px-6 md:pt-14 md:pb-16">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <Link href="/predict">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Kembali ke unggah
            </Link>
          </Button>

          <div className="mt-4 grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Hasil Deteksi
              </p>
              <h1 className="mt-3 text-2xl leading-tight tracking-tight sm:text-3xl md:text-4xl">
                {data.mode === "single"
                  ? `Bahan terdeteksi: ${capitalize(data.prediction.detected_item)}`
                  : `${data.detected_ingredients.length} bahan teridentifikasi`}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-[15px]">
                Pilih salah satu rekomendasi menu di bawah untuk melihat resep,
                cara memasak, dan informasi gizinya.
              </p>
            </div>

            {data.mode === "single" && (
              <div className="md:col-span-5">
                <Card className="overflow-hidden border-border">
                  <CardContent className="flex items-center gap-5 p-5 sm:p-6">
                    {/* Confidence ring */}
                    <div className="flex-shrink-0">
                      <ConfidenceRing value={data.prediction.confidence_score} />
                    </div>

                    {/* Divider */}
                    <div className="h-20 w-px bg-border flex-shrink-0" />

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Bahan Terdeteksi
                      </p>
                      <p className="text-2xl font-semibold capitalize leading-tight">
                        {data.prediction.detected_item}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {data.filename}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 md:py-16">
          {data.mode === "multi" && (
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Hasil Deteksi
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {data.total_processed} bahan berhasil dikenali
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Dari {data.total_images} gambar yang diunggah, berikut bahan yang terdeteksi beserta tingkat akurasinya.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.per_image_predictions.map((p, i) => (
                  <div
                    key={`${p.filename}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-semibold text-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold capitalize">
                        {p.error ? (
                          <span className="text-destructive">Gagal</span>
                        ) : (
                          p.detected_item ?? "-"
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{p.filename}</p>
                    </div>
                    {p.confidence_percent && (
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {p.confidence_percent}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.mode === "multi" && <Separator className="my-4" />}

          {data.menu_recommendations?.length > 0 && (
            <FadeUp className="mt-2">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-xl">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    Rekomendasi Menu
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                    menu gizi seimbang untuk bahan ini
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Klik salah satu menu untuk melihat resep lengkap dan informasi gizinya.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.menu_recommendations.map((m, i) => (
                  <MenuRecommendationCard
                    key={`${m.menu_name}-${m.rank}`}
                    menu={m}
                    index={i}
                  />
                ))}
              </div>
            </FadeUp>
          )}

          <div className="mt-12">
            <MedicalDisclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
