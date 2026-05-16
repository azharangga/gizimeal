import type { Metadata } from "next";
import { MenuPage } from "@/components/pages/predict-menu-page";

export const metadata: Metadata = {
  title: "Resep & Cara Memasak - GiziMeal",
  description: "Resep, bahan, dan informasi gizi untuk menu rekomendasi GiziMeal.",
};

export default function Page() {
  return <MenuPage />;
}
