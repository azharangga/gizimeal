import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[var(--primary)] text-primary-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-12">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, white 22%, transparent), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, white 14%, transparent), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image src={logo} alt="GiziMeal" className="h-9 w-auto object-contain brightness-0 invert" height={36} width={120} />
        </Link>
      </div>

      <div className="relative z-10">
        <h1 className="max-w-md text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
          Kenali bahan, pahami gizinya, sajikan menu dengan gizi seimbang.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-primary-foreground/85">
          Foto bahan makanan yang kamu punya, lalu dapatkan rekomendasi menu
          lengkap beserta informasi gizinya berdasarkan Pedoman Gizi Seimbang dan Angka Kecukupan Gizi (AKG)
          Kemenkes RI.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-3 text-xs text-primary-foreground/70">
        <span className="h-px w-8 bg-primary-foreground/40" />
        <span className="uppercase tracking-[0.18em]">Capstone Project CC26-PSU393</span>
      </div>
    </aside>
  );
}
