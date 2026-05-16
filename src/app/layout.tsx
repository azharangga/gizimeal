import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GiziMeal, Deteksi Bahan Makanan & Rekomendasi menu gizi seimbang",
  description:
    "Platform untuk mengenali bahan makanan, menampilkan informasi gizi, dan memberi rekomendasi menu gizi seimbang.",
  openGraph: {
    title: "GiziMeal, Deteksi Bahan & menu gizi seimbang",
    description:
      "Deteksi bahan makanan, estimasi kalori, dan rekomendasi menu gizi seimbang.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  icons: [
    { rel: "icon", type: "image/x-icon", url: "/favicon.ico" },
    { rel: "icon", type: "image/png", url: "/favicon.png" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
