"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";

declare global {
  interface Window {
    SwaggerUIBundle: (config: Record<string, unknown>) => void;
  }
}

export function ApiDocsPage() {
  useEffect(() => {
    // Load Swagger UI CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css";
    document.head.appendChild(link);

    // Load Swagger UI JS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.onload = () => {
      if (window.SwaggerUIBundle) {
        window.SwaggerUIBundle({
          url: "/api/swagger",
          dom_id: "#swagger-ui",
          deepLinking: true,
          layout: "BaseLayout",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <PageHeader
            eyebrow="API"
            title="Dokumentasi REST API"
            lead="Referensi lengkap endpoint API GiziMeal. Gunakan Swagger UI di bawah untuk menjelajahi dan menguji endpoint."
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div id="swagger-ui" />
        </div>
      </section>
    </>
  );
}
