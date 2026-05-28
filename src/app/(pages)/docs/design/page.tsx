import type { Metadata } from "next";
import { DesignSystemPage } from "@/components/pages/design-system-page";

export const metadata: Metadata = {
  title: "Design System - GiziMeal",
  description:
    "Dokumentasi sistem desain visual GiziMeal: tipografi, palet warna, spacing, dan komponen.",
};

export default function Page() {
  return <DesignSystemPage />;
}
