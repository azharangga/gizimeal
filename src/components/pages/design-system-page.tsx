"use client";

const colors = {
  primary: [
    { name: "Primary", hex: "#00935d", desc: "CTA, tombol utama, focus ring" },
    { name: "Primary Hover", hex: "#00804c", desc: "Hover state tombol primary" },
    { name: "Primary Foreground", hex: "#fcfcfc", desc: "Teks di atas elemen primary" },
  ],
  text: [
    { name: "Foreground", hex: "#101a21", desc: "Teks utama, heading, body" },
    { name: "Ink", hex: "#09131a", desc: "Penekanan teks maksimal" },
    { name: "Muted Foreground", hex: "#5c656b", desc: "Teks sekunder, deskripsi" },
  ],
  surface: [
    { name: "Background", hex: "#ffffff", desc: "Latar belakang halaman" },
    { name: "Surface Alt", hex: "#f7fbf9", desc: "Section bergantian" },
    { name: "Surface Warm", hex: "#f1f7f3", desc: "Area highlight" },
    { name: "Card", hex: "#ffffff", desc: "Latar belakang card" },
    { name: "Secondary", hex: "#f2f6f4", desc: "Background elemen sekunder" },
    { name: "Accent", hex: "#e4f3ea", desc: "Background aksen ringan" },
  ],
  border: [
    { name: "Border", hex: "#e2e5e8", desc: "Border default, card divider" },
    { name: "Border Soft", hex: "#eceff1", desc: "Pemisah ringan" },
    { name: "Input", hex: "#e2e5e8", desc: "Border field input" },
    { name: "Ring", hex: "#00935d", desc: "Focus ring interaktif" },
  ],
  semantic: [
    { name: "Destructive", hex: "#de3c37", desc: "Error, aksi berbahaya" },
    { name: "Clay", hex: "#cd753f", desc: "Aksen warm, variasi chart" },
  ],
  chart: [
    { name: "Chart 1", hex: "#00935d", desc: "Emerald" },
    { name: "Chart 2", hex: "#3ea576", desc: "Green light" },
    { name: "Chart 3", hex: "#cd753f", desc: "Warm/clay" },
    { name: "Chart 4", hex: "#3179a6", desc: "Blue" },
    { name: "Chart 5", hex: "#aa9e7b", desc: "Yellow-green" },
  ],
};

const darkColors = [
  { name: "Primary", hex: "#00ac6c", desc: "CTA, link aktif" },
  { name: "Background", hex: "#060a0d", desc: "Latar belakang halaman" },
  { name: "Card", hex: "#0e1216", desc: "Latar belakang card" },
  { name: "Foreground", hex: "#e5e8eb", desc: "Teks utama" },
  { name: "Muted", hex: "#7b8186", desc: "Teks sekunder" },
  { name: "Border", hex: "#252a2d", desc: "Border" },
  { name: "Secondary", hex: "#12171a", desc: "Background sekunder" },
  { name: "Destructive", hex: "#de3c37", desc: "Error, aksi berbahaya" },
];

const typeScale = [
  { name: "Display Hero", size: "50px", weight: "600", tracking: "-0.02em", sample: "Main Heading" },
  { name: "Display Section", size: "44px", weight: "600", tracking: "-0.02em", sample: "Section Heading" },
  { name: "Display MD", size: "36px", weight: "600", tracking: "-0.02em", sample: "Sub Section Title" },
  { name: "Display SM", size: "28px", weight: "600", tracking: "-0.02em", sample: "Card Group Heading" },
  { name: "Heading LG", size: "20px", weight: "600", tracking: "-0.015em", sample: "Feature Title Example" },
  { name: "Heading MD", size: "18px", weight: "500", tracking: "-0.015em", sample: "Smaller heading for sub-content" },
  { name: "Body Lead", size: "17px", weight: "400", tracking: "0", sample: "Introductory paragraph that provides context below the main heading." },
  { name: "Body Default", size: "14px", weight: "400", tracking: "0", sample: "Standard body text used for descriptions, explanations, and general content." },
  { name: "Nav Link", size: "13px", weight: "400", tracking: "0.02em", sample: "Home  About  Services  Contact  Blog" },
  { name: "Caption", size: "12px", weight: "400", tracking: "0", sample: "Helper text, footnotes, and metadata information." },
  { name: "Eyebrow", size: "11px", weight: "600", tracking: "0.22em", sample: "SECTION LABEL" },
];

const spacingScale = [
  { token: "xxs", value: "2px", width: 8 },
  { token: "xs", value: "4px", width: 16 },
  { token: "sm", value: "8px", width: 32 },
  { token: "md", value: "12px", width: 48 },
  { token: "lg", value: "16px", width: 64 },
  { token: "xl", value: "24px", width: 96 },
  { token: "2xl", value: "32px", width: 128 },
  { token: "huge", value: "64px", width: 256 },
];

const radiusScale = [
  { token: "xs", value: "4px" },
  { token: "sm", value: "6px" },
  { token: "md", value: "8px" },
  { token: "lg", value: "12px" },
  { token: "xl", value: "16px" },
  { token: "full", value: "9999px" },
];

export function DesignSystemPage() {
  return (
    <div className="pb-20">
      {/* Header */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <header className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Sistem Desain</p>
            <h1 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-[34px] md:text-[44px]">
              Panduan Visual GiziMeal
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:text-base">
              Dokumentasi lengkap sistem desain visual mencakup typography, color palette, spacing, radius, dan aturan penerapan di seluruh halaman.
            </p>
          </header>
        </div>
      </section>

      {/* 01 Logo */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="01 - Brand" title="Logo" lead="Identitas visual utama GiziMeal beserta filosofi, varian, dan aturan penggunaan." />

          {/* Logo Variants - 4 in a row */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="group overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-center bg-card px-4 py-8">
                <img src="/logo.png" alt="Wordmark Light" className="h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="border-t border-border px-4 py-3">
                <p className="text-[12px] font-semibold">Wordmark</p>
                <p className="text-[10px] text-muted-foreground">Light background</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-xl border border-[#252a2d] bg-[#060a0d]">
              <div className="flex items-center justify-center px-4 py-8">
                <img src="/logo.png" alt="Wordmark Dark" className="h-8 w-auto object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="border-t border-[#252a2d] px-4 py-3">
                <p className="text-[12px] font-semibold text-[#e5e8eb]">Wordmark</p>
                <p className="text-[10px] text-[#7b8186]">Dark background</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-center bg-card px-4 py-8">
                <img src="/favicon.png" alt="Icon Light" className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="border-t border-border px-4 py-3">
                <p className="text-[12px] font-semibold">Icon Mark</p>
                <p className="text-[10px] text-muted-foreground">Favicon, app icon</p>
              </div>
            </div>
            <div className="group overflow-hidden rounded-xl border border-[#252a2d] bg-[#060a0d]">
              <div className="flex items-center justify-center px-4 py-8">
                <img src="/favicon.png" alt="Icon Dark" className="h-10 w-auto object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="border-t border-[#252a2d] px-4 py-3">
                <p className="text-[12px] font-semibold text-[#e5e8eb]">Icon Mark</p>
                <p className="text-[10px] text-[#7b8186]">Dark mode</p>
              </div>
            </div>
          </div>

          {/* Philosophy + Brand Colors side by side */}
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Filosofi & Prinsip</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Logo dibangun dari prinsip kesederhanaan dan kepercayaan. Bentuk clean tanpa ornamen mencerminkan pendekatan berbasis data yang transparan. Emerald green menyimbolkan kesehatan, kesegaran, dan keseimbangan nutrisi.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Gunakan wordmark untuk konteks formal, icon untuk ruang terbatas
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Clear space minimal setara tinggi logo di setiap sisi
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Ukuran minimum 32px height untuk keterbacaan
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  Tidak memerlukan tagline atau elemen dekoratif tambahan
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-tight">Warna Brand</h3>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <div className="h-8 w-8 shrink-0 rounded" style={{ background: "#00935d" }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold">Primary <span className="font-mono font-normal text-muted-foreground">#00935d</span></p>
                    <p className="text-[10px] text-muted-foreground">Kesehatan, nutrisi, kesegaran bahan pangan alami</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <div className="h-8 w-8 shrink-0 rounded" style={{ background: "#00804c" }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold">Deep Green <span className="font-mono font-normal text-muted-foreground">#00804c</span></p>
                    <p className="text-[10px] text-muted-foreground">Hover state, feedback visual interaksi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <div className="h-8 w-8 shrink-0 rounded" style={{ background: "#101a21" }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold">Ink <span className="font-mono font-normal text-muted-foreground">#101a21</span></p>
                    <p className="text-[10px] text-muted-foreground">Near-black, mengurangi kelelahan mata</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <div className="h-8 w-8 shrink-0 rounded border border-border" style={{ background: "#ffffff" }} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold">Canvas <span className="font-mono font-normal text-muted-foreground">#ffffff</span></p>
                    <p className="text-[10px] text-muted-foreground">Kanvas netral agar warna aksen menonjol</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Rules - compact */}
          <div className="mt-10">
            <h3 className="mb-3 text-sm font-semibold tracking-tight">Aturan Penggunaan</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="group rounded-lg border border-border p-3 text-center">
                <div className="flex h-12 items-center justify-center">
                  <img src="/favicon.png" alt="" className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="mt-2 text-[10px] font-medium text-primary">Benar</p>
                <p className="text-[9px] text-muted-foreground">Background terang</p>
              </div>
              <div className="group rounded-lg border border-border p-3 text-center">
                <div className="flex h-12 items-center justify-center rounded bg-[#060a0d]">
                  <img src="/favicon.png" alt="" className="h-7 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="mt-2 text-[10px] font-medium text-primary">Benar</p>
                <p className="text-[9px] text-muted-foreground">Background gelap</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <div className="flex h-12 items-center justify-center">
                  <img src="/favicon.png" alt="" className="h-7 w-auto object-contain opacity-30" />
                </div>
                <p className="mt-2 text-[10px] font-medium text-destructive">Salah</p>
                <p className="text-[9px] text-muted-foreground">Opacity rendah</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <div className="flex h-12 items-center justify-center">
                  <img src="/favicon.png" alt="" className="h-7 w-auto skew-x-12 object-contain" />
                </div>
                <p className="mt-2 text-[10px] font-medium text-destructive">Salah</p>
                <p className="text-[9px] text-muted-foreground">Distorsi bentuk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Font Family */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="02 - Font" title="Font Family" lead="Inter sebagai satu-satunya typeface di seluruh UI." />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sans (Primary)</p>
              <p className="mt-4 text-[40px] font-semibold leading-none tracking-tight">Inter</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Geometric-humanist sans-serif. Digunakan untuk display, heading, body, label, dan seluruh elemen UI.
              </p>
              <div className="mt-4 rounded-lg bg-secondary/60 px-4 py-3">
                <code className="font-mono text-[11px] text-muted-foreground">
                  &quot;Inter&quot;, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, sans-serif
                </code>
              </div>
            </div>
            <div className="rounded-xl border border-border p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monospace</p>
              <p className="mt-4 font-mono text-[40px] font-normal leading-none">0123</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                System monospace stack. Digunakan untuk blok kode, angka tabular, dan data numerik.
              </p>
              <div className="mt-4 rounded-lg bg-secondary/60 px-4 py-3">
                <code className="font-mono text-[11px] text-muted-foreground">
                  ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 Color Palette */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="03 - Colors" title="Color Palette" lead="Token warna utama untuk brand dan permukaan." />

          <ColorGroup title="Primary" items={colors.primary} />
          <ColorGroup title="Text" items={colors.text} />
          <ColorGroup title="Surface" items={colors.surface} />
          <ColorGroup title="Border & Input" items={colors.border} />
          <ColorGroup title="Semantic" items={colors.semantic} />

          <h3 className="mb-4 mt-12 text-base font-semibold tracking-tight">Chart Colors</h3>
          <div className="flex flex-wrap gap-4">
            {colors.chart.map((c) => (
              <div key={c.name} className="text-center">
                <div className="h-14 w-14 rounded-lg" style={{ background: c.hex }} />
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">{c.hex}</p>
                <p className="text-[10px] text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 Typography */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="04 - Typography" title="Type Scale" lead="Variasi melalui weight, size, dan tracking." />

          <div className="mt-12 overflow-hidden rounded-xl border border-border">
            {typeScale.map((t, i) => (
              <div key={t.name} className={`grid grid-cols-1 sm:grid-cols-[180px_1fr] ${i < typeScale.length - 1 ? "border-b border-border" : ""}`}>
                <div className="border-b border-border bg-[var(--surface-alt)] px-5 py-4 sm:border-b-0 sm:border-r">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{t.size} / {t.weight} / {t.tracking}</p>
                </div>
                <div className="overflow-hidden px-5 py-4 sm:px-8">
                  <p
                    className="truncate"
                    style={{
                      fontSize: t.size,
                      fontWeight: Number(t.weight),
                      letterSpacing: t.tracking,
                      lineHeight: Number(t.size.replace("px", "")) > 24 ? "1.1" : "1.5",
                      color: Number(t.weight) === 400 ? "var(--muted-foreground)" : undefined,
                    }}
                  >
                    {t.sample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 Font Weight */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="05 - Weight" title="Font Weight" lead="Tiga level weight yang digunakan di seluruh sistem." />

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              { weight: 400, name: "Regular", desc: "Body text, paragraf, deskripsi" },
              { weight: 500, name: "Medium", desc: "Button, form label, heading kecil" },
              { weight: 600, name: "Semibold", desc: "Display, heading, eyebrow" },
            ].map((w) => (
              <div key={w.weight} className="rounded-xl border border-border p-6">
                <p className="text-[32px] leading-none tracking-tight" style={{ fontWeight: w.weight }}>Aa</p>
                <p className="mt-4 text-sm font-semibold">{w.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">Weight {w.weight}. {w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Spacing */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="06 - Spacing" title="Spacing Scale" lead="Sistem spacing berbasis 4px/8px untuk konsistensi layout." />

          <div className="mt-12 max-w-xl space-y-0">
            {spacingScale.map((s) => (
              <div key={s.token} className="flex items-center gap-4 border-b border-border-soft py-3">
                <p className="w-14 shrink-0 font-mono text-xs text-muted-foreground">{s.value}</p>
                <div
                  className="h-6 rounded bg-primary/80"
                  style={{ width: `min(${s.width}px, 100%)` }}
                />
                <p className="font-mono text-[11px] text-muted-foreground">{s.token}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 Border Radius */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="07 - Radius" title="Border Radius" lead="Skala radius pada komponen UI." />

          <div className="mt-12 flex flex-wrap gap-6">
            {radiusScale.map((r) => (
              <div key={r.token} className="text-center">
                <div
                  className="h-[72px] w-[72px] border-2 border-border bg-[var(--surface-alt)]"
                  style={{ borderRadius: r.value }}
                />
                <p className="mt-2 text-[11px] font-medium text-muted-foreground">{r.token}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 Elevation */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="08 - Elevation" title="Shadow & Depth" lead="Level elevasi untuk memberi kedalaman visual." />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              { level: "Level 0", shadow: "none", border: true, desc: "Flat, 1px border. Card default." },
              { level: "Level 1", shadow: "0 1px 3px rgba(0,0,0,0.06)", border: false, desc: "Subtle lift. Card hover." },
              { level: "Level 2", shadow: "0 8px 24px rgba(0,0,0,0.08)", border: false, desc: "Floating element. Dropdown." },
              { level: "Level 3", shadow: "0 16px 48px rgba(0,0,0,0.12)", border: false, desc: "Modal, dialog overlay." },
            ].map((e) => (
              <div
                key={e.level}
                className="flex flex-col items-center rounded-xl bg-card p-6 text-center"
                style={{
                  boxShadow: e.shadow === "none" ? undefined : e.shadow,
                  border: e.border ? "1px solid var(--border)" : undefined,
                }}
              >
                <div
                  className="mb-4 h-16 w-16 rounded-lg bg-background"
                  style={{
                    boxShadow: e.shadow === "none" ? undefined : e.shadow,
                    border: e.border ? "1px solid var(--border)" : undefined,
                  }}
                />
                <p className="text-sm font-semibold">{e.level}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 Dark Mode */}
      <section className="bg-[#060a0d] text-[#e5e8eb]">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8186]">09 - Dark Mode</p>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-tight text-[#e5e8eb] sm:text-4xl">Dark Mode Palette</h2>
          <p className="mt-2 text-sm text-[#7b8186]">Warna yang berubah saat dark mode aktif.</p>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {darkColors.map((c) => (
              <div key={c.name} className="overflow-hidden rounded-xl border border-[#252a2d] bg-[#0e1216]">
                <div className="h-20 border-b border-[#252a2d]" style={{ background: c.hex }} />
                <div className="p-3">
                  <p className="text-[12px] font-semibold text-[#e5e8eb]">{c.name}</p>
                  <p className="font-mono text-[11px] text-[#7b8186]">{c.hex}</p>
                  <p className="mt-1 text-[10px] text-[#7b8186]">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09 OpenType Features */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="10 - Features" title="OpenType Features" lead="Fitur tipografi yang diaktifkan secara global." />

          <div className="mt-12 overflow-hidden rounded-xl border border-border">
            {[
              { feature: "ss01", desc: "Stylistic Set 1 - alternate letterforms untuk keterbacaan" },
              { feature: "cv11", desc: "Character Variant 11 - single-storey 'a' (opsional)" },
              { feature: "tnum", desc: "Tabular Nums - angka lebar seragam untuk tabel" },
            ].map((f, i) => (
              <div key={f.feature} className={`flex items-center gap-6 px-5 py-4 ${i < 2 ? "border-b border-border" : ""}`}>
                <code className="shrink-0 rounded bg-secondary px-2 py-1 font-mono text-xs font-medium">{f.feature}</code>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 Responsive */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="11 - Responsive" title="Breakpoints" lead="Stair-step scaling untuk kontrol presisi di setiap ukuran layar." />

          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Breakpoint</th>
                  <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Hero</th>
                  <th className="pb-3 pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Section H2</th>
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Body Lead</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-muted-foreground">
                <tr className="border-b border-border-soft">
                  <td className="py-3 pr-6 font-sans font-medium text-foreground">Mobile (&lt;640px)</td>
                  <td className="py-3 pr-6">28px</td>
                  <td className="py-3 pr-6">28px</td>
                  <td className="py-3">15px</td>
                </tr>
                <tr className="border-b border-border-soft">
                  <td className="py-3 pr-6 font-sans font-medium text-foreground">Tablet (sm: 640px)</td>
                  <td className="py-3 pr-6">36px</td>
                  <td className="py-3 pr-6">36px</td>
                  <td className="py-3">16px</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 font-sans font-medium text-foreground">Desktop (md: 768px)</td>
                  <td className="py-3 pr-6">50px</td>
                  <td className="py-3 pr-6">44px</td>
                  <td className="py-3">17px</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 11 Component Examples */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="12 - Components" title="Component Examples" lead="Preview visual komponen UI yang umum digunakan." />

          {/* Buttons */}
          <h3 className="mb-4 mt-12 text-sm font-semibold tracking-tight">Buttons</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Primary
            </button>
            <button className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground">
              Secondary
            </button>
            <button className="inline-flex items-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground">
              Destructive
            </button>
            <button className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-foreground underline underline-offset-4">
              Link
            </button>
          </div>

          {/* Cards */}
          <h3 className="mb-4 mt-12 text-sm font-semibold tracking-tight">Cards</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature Card</p>
              <h4 className="mt-3 text-lg font-semibold tracking-tight">Card Title</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Short description about the feature or content displayed inside this card component.</p>
            </div>
            <div className="rounded-xl border border-border bg-[var(--surface-alt)] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alt Surface</p>
              <h4 className="mt-3 text-lg font-semibold tracking-tight">Second Title</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Card with surface-alt background for visual variation between sections.</p>
            </div>
            <div className="rounded-xl bg-[#060a0d] p-6 text-[#e5e8eb]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7b8186]">Dark Card</p>
              <h4 className="mt-3 text-lg font-semibold tracking-tight">Third Title</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#7b8186]">Dark container for technical content or code blocks.</p>
            </div>
          </div>

          {/* Form Elements */}
          <h3 className="mb-4 mt-12 text-sm font-semibold tracking-tight">Form Elements</h3>
          <div className="max-w-sm space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Label</label>
              <input
                type="text"
                placeholder="Type something..."
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                readOnly
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Disabled</label>
              <input
                type="text"
                placeholder="Cannot edit..."
                className="h-10 w-full rounded-md border border-input bg-secondary/60 px-3 text-sm text-muted-foreground"
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Badges / Pills */}
          <h3 className="mb-4 mt-12 text-sm font-semibold tracking-tight">Badges & Pills</h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Active
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              Default
            </span>
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              Error
            </span>
            <span className="inline-flex items-center rounded-full bg-[#cd753f]/10 px-3 py-1 text-xs font-medium text-[#cd753f]">
              Warning
            </span>
          </div>
        </div>
      </section>

      {/* 12 Guidelines */}
      <section>
        <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20">
          <SectionBlock eyebrow="13 - Guidelines" title="Aturan Penerapan" lead="Prinsip yang harus diikuti saat menggunakan sistem desain ini." />

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border p-6">
              <h3 className="mb-4 text-sm font-semibold text-primary">Yang Harus Dilakukan</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Gunakan font-semibold (600) untuk heading H1-H3 dan eyebrow
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Terapkan tracking-tight (-0.02em) pada display dan heading besar
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Gunakan leading-relaxed pada semua body text
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Awali section dengan eyebrow text (11px, uppercase, tracking 0.22em)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Gunakan emerald green secara hemat, hanya untuk CTA dan elemen interaktif
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Aktifkan OpenType features ss01 dan cv11
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Gunakan tabular-nums pada data numerik dan tabel
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border p-6">
              <h3 className="mb-4 text-sm font-semibold text-destructive">Yang Harus Dihindari</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan gunakan font selain Inter di UI
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan gunakan weight 700 (bold) atau lebih
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan gunakan letter-spacing positif pada heading
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan gunakan font-size di bawah 11px
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan gunakan italic untuk penekanan
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan tambahkan warna kromatik baru selain emerald green
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  Jangan hapus antialiasing dari konfigurasi
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionBlock({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">{lead}</p>
    </div>
  );
}

function ColorGroup({ title, items }: { title: string; items: { name: string; hex: string; desc: string }[] }) {
  return (
    <>
      <h3 className="mb-4 mt-10 text-sm font-semibold tracking-tight first:mt-12">{title}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((c) => (
          <div key={c.name + c.hex} className="overflow-hidden rounded-xl border border-border">
            <div
              className="h-[88px] border-b border-border"
              style={{ background: c.hex }}
            />
            <div className="p-3">
              <p className="text-[12px] font-semibold">{c.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{c.hex}</p>
              <p className="mt-1 text-[10px] leading-snug text-muted-foreground">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
