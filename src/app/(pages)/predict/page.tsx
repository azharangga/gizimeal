import type { Metadata } from "next";
import { PredictPage } from "@/components/pages/predict-page";

export const metadata: Metadata = {
  title: "Deteksi - GiziMeal",
  description: "Unggah foto bahan makanan untuk dideteksi sistem GiziMeal dan dapatkan rekomendasi menu gizi seimbang.",
};

export default function Page() {
  return <PredictPage />;
}
