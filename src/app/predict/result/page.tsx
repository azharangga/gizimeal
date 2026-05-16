import type { Metadata } from "next";
import { ResultPage } from "./result-page";

export const metadata: Metadata = {
  title: "Hasil Deteksi - GiziMeal",
  description: "Hasil deteksi bahan dan rekomendasi menu gizi seimbang.",
};

export default function Page() {
  return <ResultPage />;
}
