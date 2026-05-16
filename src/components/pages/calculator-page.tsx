"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { PageHeader } from "@/components/common/PageHeader";
import { FadeUp } from "@/components/common/MotionWrapper";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { CalculatorResult } from "@/components/calculator/CalculatorResult";
import { calculateBMR } from "@/lib/api";
import type { BMRRequest, BMRResponse } from "@/lib/types";
import { toast } from "sonner";

export function CalculatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BMRResponse | null>(null);

  const handle = async (data: BMRRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const tId = toast.loading("Menghitung kebutuhan kalori...");
    try {
      const res = await calculateBMR(data);
      setResult(res);
      toast.success("Perhitungan selesai", {
        id: tId,
        description: "Hasil estimasi kalori harian sudah siap.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Permintaan gagal.";
      setError(msg);
      toast.error("Perhitungan gagal", { id: tId, description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <PageHeader
            eyebrow="Kalkulator AKG"
            title="Estimasi kebutuhan kalori harian."
            lead="Masukkan data dirimu untuk menghitung BMR dan TDEE berdasarkan persamaan Mifflin-St Jeor dan faktor aktivitas FAO/WHO."
          />
        </div>
      </section>

      <section>
        <FadeUp className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 md:py-14">
          {/* Form */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/30 px-5 py-3">
              <Calculator className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Data Diri</p>
            </div>
            <CardContent className="p-5 sm:p-6">
              <CalculatorForm onSubmit={handle} loading={loading} />
            </CardContent>
          </Card>

          {error && (
            <div className="mt-4">
              <ErrorAlert message={error} />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6">
              <CalculatorResult data={result} />
            </div>
          )}

          <div className="mt-10">
            <MedicalDisclaimer />
          </div>
        </FadeUp>
      </section>
    </>
  );
}
