import type { Metadata } from "next";
import { FoodsPage } from "./foods-page";

export const metadata: Metadata = {
  title: "Database Nutrisi - GiziMeal",
  description: "Cari informasi gizi makanan berdasarkan nama menu atau bahan.",
};

export default function Page() {
  return <FoodsPage />;
}
