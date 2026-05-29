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
        a: "GiziMeal adalah platform edukasi gizi yang membantu kamu mengenali bahan makanan dari foto, menghitung kebutuhan kalori harian, dan mendapatkan rekomendasi menu gizi seimbang berdasarkan pedoman resmi Kemenkes RI.",
      },
      {
        q: "Apakah GiziMeal menggantikan ahli gizi atau dokter?",
        a: "Tidak. Seluruh informasi di GiziMeal bersifat edukatif dan tidak dimaksudkan sebagai pengganti konsultasi medis. Untuk kebutuhan diet khusus atau kondisi kesehatan tertentu, silakan berkonsultasi dengan tenaga kesehatan profesional.",
      },
      {
        q: "Apakah saya perlu membuat akun?",
        a: "Fitur utama seperti Deteksi, Kalkulator, dan Tabel Gizi bisa digunakan tanpa akun. Namun, untuk menyimpan riwayat deteksi kamu perlu masuk terlebih dahulu.",
      },
      {
        q: "Fitur apa saja yang tersedia di GiziMeal?",
        a: "GiziMeal memiliki fitur Deteksi Bahan (klasifikasi foto), Kalkulator kebutuhan kalori, Tabel Gizi (database nutrisi 400+ makanan), Rekomendasi Menu gizi seimbang, Riwayat deteksi, dan Asisten AI untuk tanya jawab seputar gizi.",
      },
    ],
  },
  {
    title: "Deteksi Bahan",
    items: [
      {
        q: "Bahan apa saja yang dapat dikenali?",
        a: "Saat ini sistem mendukung 15 jenis bahan: apple, banana, bean, brinjal, cabbage, carrot, cauliflower, chicken, chilli, corn, cucumber, egg, ginger, onion, dan potato.",
      },
      {
        q: "Berapa banyak foto yang bisa diunggah sekaligus?",
        a: "Kamu bisa mengunggah hingga 15 gambar sekaligus. Format yang didukung adalah JPG dan PNG dengan ukuran maksimal 1 MB per file.",
      },
      {
        q: "Bagaimana cara mendapatkan hasil deteksi yang akurat?",
        a: "Gunakan foto dengan pencahayaan terang dan merata, latar belakang polos, satu jenis bahan per gambar, dan pastikan bahan terlihat jelas tanpa tertutup objek lain.",
      },
      {
        q: "Mengapa hasil deteksi terkadang kurang tepat?",
        a: "Faktor seperti pencahayaan kurang, sudut pengambilan foto, kemiripan bentuk antar bahan, atau bahan yang sudah diolah dapat memengaruhi akurasi. Skor kepercayaan ditampilkan agar kamu bisa menilai hasilnya.",
      },
      {
        q: "Apakah foto yang saya unggah disimpan?",
        a: "Tidak. Foto hanya diproses sesaat untuk keperluan deteksi dan tidak disimpan di server kami.",
      },
    ],
  },
  {
    title: "Kalkulator & Rekomendasi Menu",
    items: [
      {
        q: "Bagaimana kalkulator menghitung kebutuhan kalori?",
        a: "Menggunakan persamaan Mifflin–St Jeor untuk menghitung BMR (Basal Metabolic Rate), kemudian dikalikan faktor aktivitas fisik (PAL) berdasarkan standar FAO/WHO untuk mendapatkan estimasi TDEE harian.",
      },
      {
        q: "Apa arti Score AKG pada rekomendasi menu?",
        a: "Score AKG menunjukkan seberapa sesuai komposisi gizi menu tersebut terhadap Angka Kecukupan Gizi rata-rata orang dewasa Indonesia. Semakin tinggi skornya, semakin seimbang kandungan gizinya.",
      },
      {
        q: "Apakah rekomendasi menu cocok untuk semua orang?",
        a: "Rekomendasi bersifat umum untuk orang dewasa sehat. Menu tidak memperhitungkan alergi, penyakit kronis, kehamilan, atau diet khusus. Selalu konsultasikan dengan ahli gizi untuk kebutuhan spesifik.",
      },
    ],
  },
  {
    title: "Tabel Gizi & Sumber Data",
    items: [
      {
        q: "Dari mana data gizi diambil?",
        a: "Data nutrisi bersumber dari dataset yang diverifikasi ulang menggunakan acuan Permenkes No. 28/2019 (AKG) dan Pedoman Gizi Seimbang Kemenkes RI. Selengkapnya bisa dilihat di halaman Referensi.",
      },
      {
        q: "Berapa banyak data makanan yang tersedia?",
        a: "Saat ini tersedia lebih dari 400 item makanan lengkap dengan informasi energi, karbohidrat, protein, lemak, serat, dan kalsium per sajian.",
      },
      {
        q: "Apakah data gizi bisa berubah?",
        a: "Ya, data dapat diperbarui seiring tersedianya referensi terbaru dari Kemenkes RI atau sumber ilmiah lainnya.",
      },
    ],
  },
  {
    title: "Akun & Privasi",
    items: [
      {
        q: "Bagaimana cara membuat akun?",
        a: "Klik tombol Masuk di pojok kanan atas, lalu pilih Daftar. Isi nama, email, dan password untuk membuat akun baru.",
      },
      {
        q: "Apakah data pribadi saya aman?",
        a: "Kami menyimpan informasi dasar akun (nama, email, dan foto profil). Foto bahan makanan yang diunggah untuk deteksi tidak disimpan di server, dan riwayat deteksi hanya bisa diakses oleh pemilik akun.",
      },
      {
        q: "Bagaimana cara menghapus akun?",
        a: "Masuk ke menu Kelola Akun, scroll ke bagian bawah, dan klik Hapus Akun. Data akan dihapus secara permanen.",
      },
    ],
  },
];

// Keyword aliases for smarter search
const ALIASES: Record<string, string[]> = {
  foto: ["gambar", "upload", "unggah", "image"],
  akun: ["account", "login", "masuk", "daftar", "register"],
  hapus: ["delete", "hilang", "buang"],
  kalori: ["kcal", "energi", "kalor", "tdee", "bmr"],
  gizi: ["nutrisi", "nutrition", "akg"],
  bahan: ["ingredient", "makanan", "food"],
  menu: ["resep", "rekomendasi", "saran"],
  password: ["kata sandi", "sandi", "pw"],
  privasi: ["privacy", "data", "aman", "keamanan"],
  deteksi: ["klasifikasi", "scan", "prediksi", "kenali"],
  asisten: ["chatbot", "chat", "ai", "bot"],
};

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function FaqPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return groups;
    const rawTokens = tokenize(q);
    if (rawTokens.length === 0) return groups;

    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => {
          const combined = `${g.title} ${it.q} ${it.a}`;
          // Every original token (or its alias) must match somewhere
          return rawTokens.every((rt) => {
            const relatedTokens = [rt];
            for (const [key, aliases] of Object.entries(ALIASES)) {
              if (rt === key || aliases.includes(rt)) {
                relatedTokens.push(key, ...aliases);
              }
            }
            return relatedTokens.some((t) => combined.toLowerCase().includes(t));
          });
        }),
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
        </FadeUp>
      </div>

      {/* Full-width CTA section */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
            <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Masih ada pertanyaan?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba Asisten AI GiziMeal atau hubungi kami langsung.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/chatbot">Tanya Asisten AI</Link>
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
    </div>
    </>
  );
}
