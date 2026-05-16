import type { Metadata } from "next";
import { PredictPage } from "./predict-page";

export const metadata: Metadata = {
  title: "Deteksi Bahan - GiziMeal",
  description: "Unggah foto bahan makanan untuk dideteksi sistem GiziMeal dan dapatkan rekomendasi menu gizi seimbang.",
};

export default function Page() {
  return <PredictPage />;
}
