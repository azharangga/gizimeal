import type { Metadata } from "next";
import { ChatbotPage } from "@/components/pages/chatbot-page";

export const metadata: Metadata = {
  title: "Asisten - GiziMeal",
  description: "Tanyakan informasi umum seputar menu gizi seimbang, kalori, dan pemanfaatan bahan makanan.",
};

export default function Page() {
  return <ChatbotPage />;
}
