import type { Metadata } from "next";
import { ChatbotPage } from "./chatbot-page";

export const metadata: Metadata = {
  title: "Edukasi Gizi - GiziMeal",
  description: "Tanyakan informasi umum seputar menu gizi seimbang, kalori, dan pemanfaatan bahan makanan.",
};

export default function Page() {
  return <ChatbotPage />;
}
