import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq-page";

export const metadata: Metadata = {
  title: "FAQ - GiziMeal",
  description: "Jawaban atas pertanyaan yang sering diajukan tentang GiziMeal.",
};

export default function Page() {
  return <FaqPage />;
}
