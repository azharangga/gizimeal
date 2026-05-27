"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Mail, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { FadeUp, SlideInLeft } from "@/components/common/MotionWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Tentang GiziMeal",
    items: [
      {
        q: "Apa itu GiziMeal?",
        a: "Platform edukasi untuk mengenali bahan makanan, memperkirakan nilai gizinya, dan menyarankan menu gizi seimbang.",
      },
      {
        q: "Apakah GiziMeal menggantikan ahli gizi atau dokter?",
        a: "Tidak. Informasi gizi bersifat informatif dan tidak digunakan sebagai acuan medis. Untuk kebutuhan khusus, konsultasikan dengan tenaga kesehatan.",
      },
      {
        q: "Apakah saya perlu membuat akun?",
        a: "Tidak. Semua fitur bisa digunakan langsung tanpa pendaftaran.",
      },
    ],
  },
  {
    title: "Deteksi Bahan",
    items: [
      {
        q: "Bahan apa saja yang dapat dikenali?",
        a: "15 bahan umum: apple, banana, bean, brinjal, cabbage, carrot, cauliflower, chicken, chilli, corn, cucumber, egg, ginger, onion, dan potato.",
      },
      {
        q: "Bagaimana cara mendapatkan hasil deteksi yang akurat?",
        a: "Gunakan foto bahan mentah dengan pencahayaan cukup, latar bersih, dan satu bahan dominan per gambar.",
      },
      {
        q: "Mengapa hasil deteksi terkadang kurang tepat?",
        a: "Pencahayaan, sudut, dan kemiripan bentuk bahan dapat memengaruhi prediksi. Skor akurasi ditampilkan agar Anda bisa menilainya.",
      },
    ],
  },
  {
    title: "Kalkulator & Rekomendasi",
    items: [
      {
        q: "Bagaimana kalkulator AKG menghitung kebutuhan kalori?",
        a: "Memakai persamaan Mifflin–St Jeor untuk BMR, dikalikan faktor aktivitas (PAL) FAO/WHO untuk TDEE harian.",
      },
      {
        q: "Apa arti Score AKG pada rekomendasi menu?",
        a: "Indikator kesesuaian menu terhadap Angka Kecukupan Gizi rata-rata orang dewasa. Semakin tinggi, semakin seimbang.",
      },
      {
        q: "Apakah rekomendasi menu cocok untuk semua orang?",
        a: "Rekomendasi bersifat umum dan tidak memperhitungkan alergi, penyakit kronis, kehamilan, atau diet khusus. Informasi gizi bersifat informatif dan tidak digunakan sebagai acuan medis.",
      },
    ],
  },
  {
    title: "Sumber Data & Privasi",
    items: [
      {
        q: "Dari mana data gizi diambil?",
        a: "Merujuk pada Permenkes No. 28/2019 (AKG) dan Pedoman Gizi Seimbang Kemenkes RI, selengkapnya di halaman Referensi.",
      },
      {
        q: "Apakah foto yang saya unggah disimpan?",
        a: "Tidak. Foto hanya diproses sesaat untuk prediksi dan tidak disimpan.",
      },
    ],
  },
];

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function FaqPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (it) =>
            it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [q]);
  const totalMatches = filtered.reduce((s, g) => s + g.items.length, 0);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <PageHeader
            eyebrow="FAQ"
            title="Hal yang sering ditanyakan."
            lead="Ringkasan penjelasan singkat seputar cara kerja, sumber data, dan batasan layanan GiziMeal."
          />

          <FadeUp delay={0.2} className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari pertanyaan, contoh: kalori, deteksi..."
                className="h-11 rounded-xl border-border bg-background pl-10 text-[15px] shadow-sm"
                aria-label="Cari pertanyaan"
              />
            </div>
            {q && (
              <p className="mt-2 text-xs text-muted-foreground">
                {totalMatches} hasil untuk &ldquo;{query}&rdquo;
              </p>
            )}
          </FadeUp>
        </div>
      </section>

    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <SlideInLeft className="md:col-span-4">
          <nav className="md:sticky md:top-24 flex flex-wrap gap-1 text-sm md:block md:space-y-1">
            {filtered.map((g) => (
              <a
                key={g.title}
                href={`#${slug(g.title)}`}
                className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {g.title}
              </a>
            ))}
          </nav>
        </SlideInLeft>

        <FadeUp className="md:col-span-8">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-[var(--surface-alt)] p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Tidak ada pertanyaan yang cocok. Coba kata kunci lain.
              </p>
            </div>
          ) : filtered.map((g) => (
            <section
              key={g.title}
              id={slug(g.title)}
              className="mb-12 scroll-mt-24"
            >
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {g.title}
              </h2>
              <Accordion type="single" collapsible className="mt-3">
                {g.items.map((it, i) => (
                  <AccordionItem
                    key={it.q}
                    value={`${slug(g.title)}-${i}`}
                    className="border-b border-border-soft"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                      {it.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {it.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}

          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
                <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Masih ada pertanyaan?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coba asisten edukasi GiziMeal atau hubungi kami langsung.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href="/chatbot">Tanya Asisten</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href="mailto:halo@gizimeal.id">
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      Hubungi Kami
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <MedicalDisclaimer />
          </div>
        </FadeUp>
      </div>
    </div>
    </>
  );
}
