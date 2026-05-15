import { createFileRoute } from "@tanstack/react-router";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { PageHeader } from "@/components/common/PageHeader";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { FadeUp } from "@/components/common/MotionWrapper";

export const Route = createFileRoute("/chatbot")({
  component: ChatbotPage,
  head: () => ({
    meta: [
      { title: "Edukasi Gizi - GiziMeal" },
      {
        name: "description",
        content:
          "Tanyakan informasi umum seputar menu gizi seimbang, kalori, dan pemanfaatan bahan makanan.",
      },
    ],
  }),
});

function ChatbotPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 pt-10 pb-8 sm:px-6 sm:pt-12 sm:pb-10 md:pt-16 md:pb-12">
          <PageHeader
            eyebrow="Edukasi Gizi"
            title="Asisten edukasi gizi interaktif."
            lead="Asisten edukasi GiziMeal siap menjawab pertanyaan umum tentang kalori, kebutuhan gizi harian, dan ide menu seimbang berbasis Pedoman Gizi Seimbang."
          />
        </div>
      </section>

      <section>
        <FadeUp className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
          <div className="h-[600px] sm:h-[640px] md:h-[680px]">
            <ChatInterface />
          </div>
          <div className="mt-8">
            <MedicalDisclaimer />
          </div>
        </FadeUp>
      </section>
    </>
  );
}
