import type { Metadata } from "next";
import { HomePage } from "./home-page";

export const metadata: Metadata = {
  title: "GiziMeal - Edukasi Gizi Berbasis Pedoman Kemenkes RI",
  description:
    "Klasifikasi bahan makanan otomatis, kalkulator AKG, dan rekomendasi menu gizi seimbang berdasarkan Permenkes No. 28/2019 dan Pedoman Gizi Seimbang Kemenkes RI.",
};

export default function Page() {
  return <HomePage />;
}
