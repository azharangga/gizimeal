import type { Metadata } from "next";
import { RegisterPage } from "@/components/pages/register-page";

export const metadata: Metadata = {
  title: "Daftar - GiziMeal",
  description: "Buat akun GiziMeal untuk menyimpan riwayat deteksi bahan dan rekomendasi menu gizi seimbang.",
};

export default function Page() {
  return <RegisterPage />;
}
