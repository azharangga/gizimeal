"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calculator, Database, ExternalLink, FileText, Globe2, ScrollText } from "lucide-react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";

type Reference = {
  code: string;
  title: string;
  publisher: string;
  year: string;
  used_for: string;
  url?: string;
};

const PERMENKES: Reference[] = [
  {
    code: "Permenkes No. 28 Tahun 2019",
    title: "Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia",
    publisher: "Kementerian Kesehatan Republik Indonesia",
    year: "2019",
    used_for:
      "Acuan kebutuhan energi, protein, lemak, karbohidrat, serat, vitamin, dan mineral harian per kelompok usia dan jenis kelamin.",
    url: "https://peraturan.bpk.go.id/Details/138621/permenkes-no-28-tahun-2019",
  },
  {
    code: "Permenkes No. 41 Tahun 2014",
    title: "Pedoman Gizi Seimbang",
    publisher: "Kementerian Kesehatan Republik Indonesia",
    year: "2014",
    used_for:
      "Prinsip empat pilar gizi seimbang, anjuran konsumsi sayur-buah, dan komposisi piring makanku yang menjadi dasar rekomendasi menu.",
    url: "https://peraturan.bpk.go.id/Details/119080/permenkes-no-41-tahun-2014",
  },
];

const INTERNATIONAL: Reference[] = [
  {
    code: "WHO Healthy Diet (2020)",
    title: "Healthy Diet, Fact Sheet",
    publisher: "World Health Organization",
    year: "2020",
    used_for:
      "Rekomendasi internasional asupan energi, lemak jenuh, gula bebas, dan natrium harian.",
    url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  },
  {
    code: "Mifflin–St Jeor (1990)",
    title:
      "A new predictive equation for resting energy expenditure in healthy individuals",
    publisher: "American Journal of Clinical Nutrition",
    year: "1990",
    used_for:
      "Persamaan estimasi BMR yang digunakan pada Kalkulator Kebutuhan Kalori GiziMeal.",
    url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
  },
  {
    code: "FAO/WHO/UNU (2001)",
    title: "Human Energy Requirements, Physical Activity Level (PAL)",
    publisher: "FAO of the United Nations",
    year: "2001",
    used_for:
      "Faktor pengali aktivitas (sedentary–very active) untuk menghitung TDEE.",
    url: "https://www.fao.org/3/y5686e/y5686e00.htm",
  },
];

const DATASETS: Reference[] = [
  {
    code: "Kaggle Dataset (Gambar)",
    title: "Food Image Classification Dataset",
    publisher: "Kaggle (Open Dataset Community)",
    year: "2023",
    used_for:
      "Sumber gambar bahan makanan untuk pelatihan model klasifikasi pada fitur Deteksi GiziMeal. Setiap kelas diverifikasi ulang sebelum digunakan.",
    url: "https://www.kaggle.com/datasets",
  },
  {
    code: "Kaggle Dataset (CSV Gizi)",
    title: "Food Nutrition Dataset",
    publisher: "Kaggle (Open Dataset Community)",
    year: "2023",
    used_for:
      "File CSV berisi daftar nama menu makanan beserta kandungan gizinya (energi, karbohidrat, protein, lemak, serat, kalsium). Digunakan sebagai sumber data Database Gizi dan rekomendasi menu, diverifikasi ulang dengan acuan AKG dan Pedoman Gizi Seimbang.",
    url: "https://www.kaggle.com/datasets",
  },
];

function Section({
  icon: Icon,
  title,
  caption,
  items,
}: {
  icon: typeof FileText;
  title: string;
  caption: string;
  items: Reference[];
}) {
  return (
    <section className="mt-16 first:mt-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold text-2xl">{title}</h2>
          <p className="text-sm text-muted-foreground">{caption}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {items.map((r, i) => (
          <motion.li
            key={r.code}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="rounded-xl border border-border-soft bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {r.code}
                </p>
                <h3 className="mt-1 font-semibold text-lg leading-snug">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.publisher} · {r.year}
                </p>
              </div>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex flex-shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  Akses sumber <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="mt-3 border-t border-border-soft pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Digunakan untuk
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                {r.used_for}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function FormulasSection() {
  return (
    <section className="mt-16">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Calculator className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold text-2xl">Rumus & Perhitungan</h2>
          <p className="text-sm text-muted-foreground">
            Persamaan matematis yang digunakan pada Kalkulator dan modul gizi GiziMeal.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <FormulaCard
          title="BMR - Mifflin–St Jeor (1990)"
          description="Estimasi Basal Metabolic Rate (kkal/hari) berdasarkan berat (W, kg), tinggi (H, cm), usia (A, tahun), dan jenis kelamin."
          equations={[
            { label: "Pria", math: "BMR = 10\\,W + 6{,}25\\,H - 5\\,A + 5" },
            { label: "Wanita", math: "BMR = 10\\,W + 6{,}25\\,H - 5\\,A - 161" },
          ]}
        />

        <FormulaCard
          title="TDEE - Total Daily Energy Expenditure"
          description="Total kebutuhan energi harian, dihitung dengan mengalikan BMR dengan faktor aktivitas (PAL)."
          equations={[{ math: "TDEE = BMR \\times PAL" }]}
          extra={
            <div className="mt-4 overflow-hidden rounded-lg border border-border-soft">
              <table className="w-full text-xs">
                <thead className="bg-[var(--surface-alt)] text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Tingkat Aktivitas</th>
                    <th className="px-3 py-2 text-right font-semibold">PAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {[
                    ["Sedentary (jarang olahraga)", "1,200"],
                    ["Light (olahraga ringan 1–3 hari/minggu)", "1,375"],
                    ["Moderate (olahraga sedang 3–5 hari/minggu)", "1,550"],
                    ["Active (olahraga berat 6–7 hari/minggu)", "1,725"],
                    ["Very active (olahraga sangat berat / pekerjaan fisik)", "1,900"],
                  ].map(([level, pal]) => (
                    <tr key={level}>
                      <td className="px-3 py-2">{level}</td>
                      <td className="px-3 py-2 text-right tnum">{pal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />

        <FormulaCard
          title="Target Kalori Harian"
          description="Penyesuaian energi terhadap TDEE sesuai tujuan: defisit, pemeliharaan, atau surplus 500 kkal/hari."
          equations={[
            { label: "Penurunan BB", math: "E_{loss} = TDEE - 500" },
            { label: "Pemeliharaan", math: "E_{maint} = TDEE" },
            { label: "Penambahan BB", math: "E_{gain} = TDEE + 500" },
          ]}
        />

        <FormulaCard
          title="Skor AKG Menu"
          description="Skor relatif kontribusi sebuah menu terhadap Angka Kecukupan Gizi harian. Menggunakan rata-rata persentase pemenuhan tiap zat gizi (energi, protein, lemak, serat, kalsium), dibatasi 100% per zat agar tidak ada zat gizi yang dominan secara berlebihan."
          equations={[
            {
              math:
                "Skor_{AKG} = \\frac{1}{n}\\sum_{i=1}^{n} \\min\\!\\left(\\frac{N_i}{AKG_i},\\,1\\right) \\times 100\\%",
            },
          ]}
        />
      </div>
    </section>
  );
}

function FormulaCard({
  title,
  description,
  equations,
  extra,
}: {
  title: string;
  description: string;
  equations: { label?: string; math: string }[];
  extra?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-card p-5">
      <h3 className="font-semibold text-base leading-snug">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-4 space-y-3">
        {equations.map((eq, i) => (
          <div
            key={i}
            className="rounded-lg border border-border-soft bg-[var(--surface-alt)] px-4 py-3"
          >
            {eq.label && (
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {eq.label}
              </p>
            )}
            <div className="overflow-x-auto text-foreground">
              <BlockMath math={eq.math} />
            </div>
          </div>
        ))}
      </div>
      {extra}
    </div>
  );
}

export function ReferencesPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Referensi Ilmiah
          </p>
          <h1 className="mt-3 font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-5xl md:leading-[1.05]">
            Sumber referensi yang menjadi dasar GiziMeal.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Seluruh estimasi kalori, kebutuhan gizi harian, dan rekomendasi menu di
            GiziMeal disusun mengacu pada peraturan resmi Kementerian Kesehatan
            Republik Indonesia, pedoman gizi nasional, dan publikasi ilmiah
            internasional yang ditinjau ahli.
          </p>
        </div>
      </section>

    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">

      <Section
        icon={ScrollText}
        title="Peraturan Menteri Kesehatan RI"
        caption="Dasar hukum dan acuan kebijakan gizi nasional."
        items={PERMENKES}
      />

      <Section
        icon={Globe2}
        title="Publikasi Ilmiah Internasional"
        caption="Persamaan ilmiah dan rekomendasi WHO/FAO yang digunakan."
        items={INTERNATIONAL}
      />

      <Section
        icon={Database}
        title="Dataset Pelatihan Model"
        caption="Sumber data gambar yang digunakan untuk melatih model klasifikasi bahan makanan, telah diverifikasi ulang dengan acuan AKG & Pedoman Gizi Seimbang."
        items={DATASETS}
      />

      <FormulasSection />

      <div className="mt-16 rounded-xl border border-border-soft bg-[var(--surface-alt)] p-6">
        <div className="flex items-start gap-3">
          <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">Catatan sitasi</p>
            <p className="mt-1">
              Daftar di atas merupakan referensi utama. Untuk publikasi akademik
              atau penggunaan profesional, mohon merujuk langsung ke dokumen sumber
              terbaru yang dikeluarkan oleh Kementerian Kesehatan RI atau
              instansi berwenang.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <MedicalDisclaimer />
      </div>
    </div>
    </>
  );
}
