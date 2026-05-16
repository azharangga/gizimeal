import type { Metadata } from "next";
import { FaqPage } from "./faq-page";

export const metadata: Metadata = {
  title: "Pertanyaan Umum - GiziMeal",
  description: "Jawaban atas pertanyaan yang sering diajukan tentang GiziMeal.",
};

export default function Page() {
  return <FaqPage />;
}
