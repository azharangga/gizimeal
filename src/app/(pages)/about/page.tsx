import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";

export const metadata: Metadata = {
  title: "Tentang GiziMeal",
  description: "GiziMeal adalah capstone project CC26-PSU393 bertema Healthy Lives & Well-Being.",
};

export default function Page() {
  return <AboutPage />;
}
