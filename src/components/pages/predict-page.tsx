"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Loader2,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { PageHeader } from "@/components/common/PageHeader";
import { FadeUp, SlideInLeft, SlideInRight } from "@/components/common/MotionWrapper";
import { FileUpload } from "@/components/prediction/FileUpload";
import { ClassesGrid } from "@/components/prediction/ClassesGrid";
import { checkHealth, predictFoods } from "@/lib/api";
import { savePrediction } from "@/lib/predict-store";
import { toast } from "sonner";

export function PredictPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth()
      .then((h) => setModelReady(h.model_loaded === true))
      .catch(() => setModelReady(false));
  }, []);

  const onSubmit = async () => {
    if (files.length === 0) {
      toast.error("Pilih minimal satu gambar untuk dideteksi.");
      return;
    }
    setLoading(true);
    setError(null);
    const tId = toast.loading("Menganalisis gambar...");
    try {
      const data = await predictFoods(files);
      savePrediction(data);
      toast.success("Deteksi berhasil", {
        id: tId,
        description: "Hasil deteksi sedang dimuat.",
      });
      router.push("/predict/result");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Permintaan gagal.";
      setError(msg);
      toast.error("Deteksi gagal", { id: tId, description: msg });
      setLoading(false);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 md:pt-20 md:pb-14">
          <PageHeader
            eyebrow="Deteksi Bahan"
            title="Foto bahan makananmu, dapatkan rekomendasi menu gizi seimbang."
            lead="Cukup unggah foto bahan yang ada di dapurmu. GiziMeal akan mengenali bahan tersebut dan memberikan rekomendasi menu lengkap dengan informasi gizinya."
          />

          {/* Steps indicator */}
          <FadeUp delay={0.2}>
            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
              {[
                { step: "1", label: "Unggah foto bahan" },
                { step: "2", label: "Sistem mendeteksi" },
                { step: "3", label: "Dapat rekomendasi menu" },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground">
                    {s.step}
                  </span>
                  <span className="text-xs text-muted-foreground sm:text-sm">{s.label}</span>
                  {i < 2 && <ArrowRight className="ml-auto hidden h-3 w-3 text-muted-foreground/50 sm:block" />}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 md:py-16">
          {modelReady === null ? (
            <PredictSkeleton />
          ) : (
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <SlideInLeft className="lg:col-span-8">
              {modelReady === false && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-clay/40 bg-clay/5 p-4 text-sm">
                  <CircleAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay" />
                  <div>
                    <p className="font-semibold">Sistem sedang tidak tersedia</p>
                    <p className="text-muted-foreground">
                      Model deteksi sedang dimuat. Coba lagi dalam beberapa saat.
                    </p>
                  </div>
                </div>
              )}

              <Card className="overflow-hidden border-border shadow-sm">
                <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">Unggah Foto Bahan</p>
                  </div>
                  <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                    {files.length} / 15
                  </span>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <FileUpload files={files} onChange={setFiles} />
                </CardContent>

                {/* Action bar */}
                <div className="flex items-center justify-end border-t border-border bg-secondary/20 px-5 py-3 sm:px-6">
                  <Button
                    size="lg"
                    onClick={onSubmit}
                    disabled={loading || files.length === 0}
                    className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <ScanLine className="mr-2 h-4 w-4" />
                        Mulai Deteksi
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {error && (
                <div className="mt-4">
                  <ErrorAlert message={error} />
                </div>
              )}

              <div className="mt-6">
                <MedicalDisclaimer compact />
              </div>
            </SlideInLeft>

            <SlideInRight className="lg:col-span-4">
              <div className="sticky top-20 space-y-4">
                {/* Supported ingredients */}
                <Card className="border-border shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">Bahan yang Didukung</p>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      15 jenis bahan mentah yang bisa dikenali sistem saat ini.
                    </p>
                    <Separator className="my-4" />
                    <ClassesGrid />
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border-border shadow-sm">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-semibold">Tips Foto yang Baik</p>
                    </div>
                    <Separator className="my-4" />
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-border" />
                        Pencahayaan terang dan merata
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-border" />
                        Satu jenis bahan per gambar untuk hasil optimal
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-border" />
                        Latar belakang polos memudahkan deteksi
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-border" />
                        Pastikan bahan terlihat jelas dan tidak tertutup
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </SlideInRight>
          </div>
          )}
        </div>
      </section>
    </>
  );
}

function PredictSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-8">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-6 py-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <CardContent className="p-4 sm:p-6">
            <Skeleton className="h-48 w-full rounded-xl" />
          </CardContent>
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </Card>
      </div>
      <aside className="lg:col-span-4">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-full" />
              <Separator className="my-4" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/40">
            <CardContent className="space-y-2 p-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}
