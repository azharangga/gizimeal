import type { Metadata } from "next";
import { ReferencesPage } from "./referensi-page";

export const metadata: Metadata = {
  title: "Referensi & Sumber Ilmiah - GiziMeal",
  description: "Daftar peraturan, pedoman Kemenkes RI, dan referensi ilmiah yang menjadi dasar GiziMeal.",
};

export default function Page() {
  return <ReferencesPage />;
}
