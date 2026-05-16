import { Info } from "lucide-react";
import Link from "next/link";

export function MedicalDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <span>
          Informasi bersifat edukatif dan bukan pengganti konsultasi tenaga
          kesehatan. Lihat{" "}
          <Link href="/referensi" className="underline underline-offset-2 hover:text-foreground">
            sumber referensi
          </Link>
          .
        </span>
      </p>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Disclaimer medis"
      className="rounded-lg border border-border-soft bg-[var(--surface-warm)]/40 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
          <Info className="h-3.5 w-3.5 text-foreground/70" />
        </span>
        <div className="text-sm leading-relaxed text-foreground/80">
          <p className="font-semibold text-foreground">Disclaimer</p>
          <p className="mt-1 text-muted-foreground">
            GiziMeal adalah platform edukasi gizi. Estimasi kalori, klasifikasi
            bahan, dan rekomendasi menu disusun berdasarkan{" "}
            <Link href="/referensi" className="text-foreground underline underline-offset-2">
              Permenkes No. 28 Tahun 2019 (AKG)
            </Link>{" "}
            dan{" "}
            <Link href="/referensi" className="text-foreground underline underline-offset-2">
              Pedoman Gizi Seimbang Kemenkes RI
            </Link>
            . Hasil bersifat informatif dan tidak menggantikan
            konsultasi dengan dokter, ahli gizi, maupun tenaga
            kesehatan profesional. Daftar lengkap sumber referensi tersedia pada halaman{" "}
            <Link href="/referensi" className="text-foreground underline underline-offset-2">
              Referensi
            </Link>
            .
          </p>
        </div>
      </div>
    </aside>
  );
}
