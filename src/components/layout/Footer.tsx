import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1280px] px-6 py-14">
        <div className="grid items-start gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src={logo} alt="GiziMeal" className="h-8 w-auto object-contain dark:brightness-0 dark:invert" height={32} width={100} />
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Platform edukasi gizi untuk mengenali bahan makanan, menyajikan
              informasi gizi, dan menyusun rekomendasi menu gizi seimbang berdasarkan
              pedoman resmi.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
              <li><Link href="/predict" className="hover:text-foreground">Deteksi</Link></li>
              <li><Link href="/history" className="hover:text-foreground">Riwayat</Link></li>
              <li><Link href="/calculator" className="hover:text-foreground">Kalkulator</Link></li>
              <li><Link href="/foods" className="hover:text-foreground">Tabel Gizi</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Informasi
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
              <li><Link href="/about" className="hover:text-foreground">Tentang Kami</Link></li>
              <li><Link href="/chatbot" className="hover:text-foreground">Asisten AI</Link></li>
              <li><Link href="/referensi" className="hover:text-foreground">Referensi</Link></li>
              <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Disclaimer
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Konten GiziMeal disusun untuk tujuan edukasi dan tidak menggantikan
              konsultasi dengan dokter atau ahli gizi. Untuk kebutuhan khusus,
              silakan berkonsultasi dengan tenaga kesehatan profesional.
            </p>
            <Link
              href="/referensi"
              className="mt-3 inline-block text-sm text-foreground underline underline-offset-4 hover:text-primary"
            >
              Lihat sumber referensi →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} GiziMeal. All rights reserved.</p>
          <p className="text-[11px] tracking-wide">Dibuat dengan <a href="https://react.dev" target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-foreground">React</a> dan <a href="https://nextjs.org" target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-foreground">Next.js</a>.</p>
        </div>
      </div>
    </footer>
  );
}
