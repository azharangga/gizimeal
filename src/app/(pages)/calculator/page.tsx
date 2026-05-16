import type { Metadata } from "next";
import { CalculatorPage } from "@/components/pages/calculator-page";

export const metadata: Metadata = {
  title: "Kalkulator BMR & TDEE - GiziMeal",
  description: "Hitung estimasi kebutuhan kalori harian berdasarkan usia, berat, tinggi, jenis kelamin, dan aktivitas.",
};

export default function Page() {
  return <CalculatorPage />;
}
