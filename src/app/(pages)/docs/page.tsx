import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiDocsPage } from "@/components/pages/api-docs-page";

export const metadata: Metadata = {
  title: "API Docs - GiziMeal",
  description: "Dokumentasi REST API GiziMeal menggunakan Swagger/OpenAPI.",
};

export default function Page() {
  // Hanya tersedia di development
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ApiDocsPage />;
}
