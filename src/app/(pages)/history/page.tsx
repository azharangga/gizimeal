import type { Metadata } from "next";
import { HistoryPage } from "@/components/pages/history-page";

export const metadata: Metadata = {
  title: "Riwayat Deteksi - GiziMeal",
  description: "Lihat riwayat hasil deteksi bahan makanan dan rekomendasi menu.",
};

export default function Page() {
  return <HistoryPage />;
}
