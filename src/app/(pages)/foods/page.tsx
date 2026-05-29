import type { Metadata } from "next";
import { FoodsPage } from "@/components/pages/foods-page";

export const metadata: Metadata = {
  title: "Tabel Gizi - GiziMeal",
  description: "Cari informasi gizi makanan berdasarkan nama menu atau bahan.",
};

export default function Page() {
  return <FoodsPage />;
}
