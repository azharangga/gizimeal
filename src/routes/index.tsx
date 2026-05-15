import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  LogIn,
  Quote,
  ScanSearch,
  ScrollText,
  Star,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import heroIngredients from "@/assets/hero-ingredients.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "GiziMeal - Edukasi Gizi Berbasis Pedoman Kemenkes RI" },
      {
        name: "description",
        content:
          "Klasifikasi bahan makanan otomatis, kalkulator AKG, dan rekomendasi menu gizi seimbang berdasarkan Permenkes No. 28/2019 dan Pedoman Gizi Seimbang Kemenkes RI.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_50%_-10%,oklch(0.42_0.07_175/.10),transparent_55%)] dark:[background-image:radial-gradient(circle_at_50%_-10%,oklch(0.42_0.14_160/.20),transparent_55%)]" />
        <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-12 md:gap-12 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7"
          >
            <h1 className="font-semibold text-[28px] leading-[1.1] tracking-tight sm:text-[36px] md:text-[50px] md:leading-[1.05]">
              Kenali bahan, pahami gizinya, sajikan menu dengan gizi seimbang.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base md:mt-6 md:text-[17px]">
              Foto bahan makanan yang kamu punya, lalu dapatkan rekomendasi menu
              lengkap beserta informasi gizinya berdasarkan{" "}
              <Link to="/referensi" className="font-semibold text-foreground underline underline-offset-2 hover:text-primary">
                Pedoman Gizi Seimbang
              </Link>{" "}
              dan{" "}
              <Link to="/referensi" className="font-semibold text-foreground underline underline-offset-2 hover:text-primary">
                Angka Kecukupan Gizi (AKG)
              </Link>{" "}
              Kemenkes RI.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <HeroCTA />
              <Button asChild size="lg" variant="outline">
                <Link to="/referensi">
                  Lihat Sumber referensi
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6 sm:gap-6 md:mt-10">
              {[
                { k: 15, suffix: "", v: "Bahan terklasifikasi" },
                { k: 500, suffix: "+", v: "Item komposisi pangan" },
                { k: 5, suffix: "", v: "referensi resmi" },
              ].map((s) => (
                <div key={s.v}>
                  <AnimatedCounter target={s.k} suffix={s.suffix} />
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="md:col-span-5"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* Disclaimer strip */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 py-4 sm:px-6">
          <p className="text-center text-xs text-muted-foreground">
            GiziMeal adalah platform edukasi gizi. Informasi bersifat informatif dan bukan pengganti konsultasi tenaga kesehatan profesional.{" "}
            <Link to="/referensi" className="underline underline-offset-2 hover:text-foreground">Lihat referensi</Link>
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Empat Pilar Layanan
              </p>
              <h2 className="mt-3 font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-[44px] md:leading-[1.05]">
                Pendekatan sederhana untuk gizi seimbang sehari-hari.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Setiap modul mengikuti alur yang mudah dipahami:
                identifikasi bahan, perhitungan kebutuhan,
                penyusunan menu, dan edukasi pendukung.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                {[
                  {
                    icon: ScanSearch,
                    title: "Klasifikasi Bahan",
                    body: "Identifikasi bahan mentah dari foto dengan skor akurasi yang transparan.",
                    to: "/predict",
                  },
                  {
                    icon: HeartPulse,
                    title: "Kalkulator AKG",
                    body: "Hitung kebutuhan kalori harian berdasarkan persamaan Mifflin-St Jeor dan PAL FAO/WHO.",
                    to: "/calculator",
                  },
                  {
                    icon: ClipboardList,
                    title: "Database Gizi",
                    body: "Informasi nutrisi lengkap per bahan pangan, diverifikasi dengan acuan AKG Kemenkes RI.",
                    to: "/foods",
                  },
                  {
                    icon: Utensils,
                    title: "Rekomendasi Menu",
                    body: "Saran menu gizi seimbang lengkap dengan resep, bahan, dan informasi nutrisi per porsi.",
                    to: "/predict",
                  },
                ].map(({ icon: Icon, title, body, to }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-background p-5 sm:p-7"
                  >
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                    <h3 className="mt-4 font-semibold text-xl">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                    <Link
                      to={to}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary"
                    >
                      Pelajari modul
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section className="border-y border-border bg-[var(--surface-alt)]">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Metodologi
            </p>
            <h2 className="mt-3 font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-[44px] md:leading-[1.05]">
              Empat tahap pemeriksaan yang ringkas dan terdokumentasi.
            </h2>
          </div>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Unggah Bahan",
                body: "Unggah foto bahan mentah dari dapur Anda.",
              },
              {
                step: "02",
                title: "Deteksi Otomatis",
                body: "Model klasifikasi memberi label dan skor akurasi.",
              },
              {
                step: "03",
                title: "Rekomendasi menu",
                body: "Sistem menyusun menu berbasis komposisi gizi.",
              },
              {
                step: "04",
                title: "Edukasi & referensi",
                body: "Disertai resep, info gizi, dan referensi resmi.",
              },
            ].map((s) => (
              <li key={s.step} className="bg-background p-5 sm:p-7">
                <p className="font-semibold text-3xl text-primary">{s.step}</p>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* EVIDENCE */}
      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Berbasis Bukti
              </p>
              <h2 className="mt-3 font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-[44px] md:leading-[1.05]">
                Rekomendasi yang dapat ditelusuri ke sumber resmi.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Setiap angka, kebutuhan kalori harian, batas asupan gula, garam,
                dan lemak, hingga komposisi menu, merujuk langsung pada peraturan
                Kementerian Kesehatan dan publikasi ilmiah yang dapat Anda
                verifikasi sendiri.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/referensi">
                    <ScrollText className="mr-1.5 h-4 w-4" />
                    Lihat semua referensi
                  </Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-7">
              <ul className="space-y-3">
                {[
                  {
                    code: "Permenkes No. 28 Tahun 2019",
                    body: "Acuan Angka Kecukupan Gizi (AKG) yang dianjurkan untuk masyarakat Indonesia per kelompok usia.",
                  },
                  {
                    code: "Permenkes No. 41 Tahun 2014",
                    body: "Pedoman Gizi Seimbang, prinsip empat pilar dan komposisi piring makanku.",
                  },
                  {
                    code: "WHO Healthy Diet (2020)",
                    body: "Rekomendasi internasional untuk asupan energi, lemak jenuh, dan natrium.",
                  },
                  {
                    code: "Mifflin–St Jeor (1990)",
                    body: "Persamaan estimasi BMR yang digunakan pada Kalkulator Kebutuhan Kalori GiziMeal.",
                  },
                  {
                    code: "FAO/WHO/UNU (2001)",
                    body: "Human Energy Requirements, Physical Activity Level (PAL) untuk estimasi TDEE.",
                  },
                ].map((r) => (
                  <li
                    key={r.code}
                    className="flex items-start gap-4 rounded-lg border border-border-soft bg-card p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {r.code}
                      </p>
                      <p className="mt-1 text-sm text-foreground/85">{r.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border overflow-hidden bg-secondary/40">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Apa kata pengguna
            </p>
            <h2 className="mt-3 font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-[44px] md:leading-[1.05]">
              Edukasi gizi yang terasa dekat dengan dapur sehari-hari.
            </h2>
          </div>
        </div>

        {/* Marquee carousel */}
        <div className="relative pb-14 sm:pb-20 md:pb-24">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />

          {/* Row 1 - scroll left */}
          <div className="mb-5 flex animate-marquee-left gap-5">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`row1-${i}`} {...t} />
            ))}
          </div>

          {/* Row 2 - scroll right */}
          <div className="flex animate-marquee-right gap-5">
            {[...testimonials2, ...testimonials2].map((t, i) => (
              <TestimonialCard key={`row2-${i}`} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Hubungi Kami
              </p>
              <h2 className="mt-3 font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-[44px] md:leading-[1.05]">
                Ada pertanyaan atau masukan?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Kami senang mendengar dari kamu. Isi formulir di samping untuk pertanyaan, saran, atau kerja sama.
              </p>
            </div>
            <div className="md:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/60">
        <div className="mx-auto max-w-[1240px] px-4 py-14 text-center sm:px-6 sm:py-20 md:py-24">
          <h2 className="mx-auto max-w-2xl font-semibold text-[28px] leading-[1.1] sm:text-4xl md:text-[48px] md:leading-[1.05]">
            Mulai pemeriksaan bahan makanan dapur Anda hari ini.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Unggah satu foto bahan dan dapatkan klasifikasi, estimasi kalori,
            serta menu gizi seimbang dalam hitungan detik, semua dengan referensi yang
            dapat ditelusuri.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
            >
              <Link to="/predict">
                Mulai Sekarang
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroCTA() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Button
      asChild
      size="lg"
      className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
    >
      <Link to="/predict">
        Mulai Deteksi Bahan
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Link>
    </Button>
  ) : (
    <Button
      asChild
      size="lg"
      className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
    >
      <Link to="/login">
        <LogIn className="mr-1.5 h-4 w-4" />
        Masuk untuk Memulai
      </Link>
    </Button>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_30%_30%,oklch(0.42_0.07_175/.14),transparent_60%)] dark:bg-[radial-gradient(circle_at_30%_30%,oklch(0.42_0.14_160/.25),transparent_60%)]" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_0_oklch(1_0_0/.8)_inset,0_24px_48px_-24px_oklch(0.22_0.015_230/.22)]">
        <img
          src={heroIngredients}
          alt="Bahan makanan segar, ayam, kentang, wortel, bawang putih, jahe, dan daun ketumbar"
          width={1024}
          height={1024}
          className="block aspect-square w-full object-cover"
        />
      </div>
    </div>
  );
}

/* Testimonial data */
const testimonials = [
  {
    name: "Rina S.",
    role: "Ibu rumah tangga, Bandung",
    quote: "Sekarang saya tahu kandungan gizi dari bahan yang biasa saya masak. Rekomendasi menunya juga praktis.",
    rating: 5,
  },
  {
    name: "Dimas P.",
    role: "Mahasiswa Gizi",
    quote: "Cocok untuk belajar AKG dan komposisi pangan tanpa harus buka tabel satu per satu.",
    rating: 4,
  },
  {
    name: "Sari W.",
    role: "Pekerja kantoran",
    quote: "Kalkulator kalorinya jelas dan saran menunya seimbang. Membantu saya menjaga pola makan.",
    rating: 5,
  },
  {
    name: "Budi H.",
    role: "Personal trainer, Jakarta",
    quote: "Klien saya jadi lebih paham soal porsi dan kebutuhan gizi harian mereka. Sangat membantu edukasi.",
    rating: 5,
  },
  {
    name: "Anisa R.",
    role: "Guru PAUD, Yogyakarta",
    quote: "Saya pakai untuk menyusun menu makan siang anak-anak di sekolah. Simpel dan informatif.",
    rating: 4,
  },
];

const testimonials2 = [
  {
    name: "Fajar M.",
    role: "Koki rumahan, Surabaya",
    quote: "Tinggal foto bahan di kulkas, langsung dapat ide menu lengkap dengan info gizinya. Keren!",
    rating: 5,
  },
  {
    name: "Lina K.",
    role: "Dietisien, Semarang",
    quote: "Referensi ilmiahnya bisa ditelusuri. Cocok untuk edukasi pasien tentang gizi seimbang.",
    rating: 4,
  },
  {
    name: "Andi T.",
    role: "Mahasiswa Kedokteran",
    quote: "Fitur chatbot-nya membantu saya memahami pedoman gizi dengan bahasa yang mudah dicerna.",
    rating: 3,
  },
  {
    name: "Maya D.",
    role: "Ibu muda, Medan",
    quote: "Akhirnya ada platform yang bantu saya tahu apakah menu harian keluarga sudah cukup gizinya.",
    rating: 5,
  },
  {
    name: "Reza A.",
    role: "Atlet renang",
    quote: "Saya bisa pantau asupan kalori dan protein harian dengan mudah. Sangat berguna untuk performa.",
    rating: 4,
  },
];

function TestimonialCard({ name, role, quote, rating }: { name: string; role: string; quote: string; rating: number }) {
  return (
    <figure className="flex w-[320px] flex-shrink-0 flex-col rounded-2xl border border-border bg-card p-5 sm:w-[360px] sm:p-6">
      <Quote className="h-5 w-5 text-primary/60" strokeWidth={1.8} />
      <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-foreground/85">
        "{quote}"
      </blockquote>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <figcaption>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </figcaption>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={i < rating ? "h-3.5 w-3.5 fill-primary text-primary" : "h-3.5 w-3.5 fill-muted-foreground/20 text-muted-foreground/20"}
              strokeWidth={0}
            />
          ))}
        </div>
      </div>
    </figure>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 80, damping: 20, duration: 1.5 });
  const rounded = useTransform(springValue, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${v}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return <p ref={ref} className="font-semibold text-2xl">0{suffix}</p>;
}

function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">Nama</label>
          <Input id="contact-name" placeholder="Nama lengkap" required className="h-11" />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">Email</label>
          <Input id="contact-email" type="email" placeholder="kamu@gmail.com" required className="h-11" />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium">Subjek</label>
        <Input id="contact-subject" placeholder="Topik pesan" required className="h-11" />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">Pesan</label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Tulis pesan kamu di sini..."
          required
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      <Button type="submit" disabled={sending || sent} className="bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]">
        {sent ? "Terkirim!" : sending ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
