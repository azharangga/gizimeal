import type { Metadata } from "next";
import { LoginPage } from "./login-page";

export const metadata: Metadata = {
  title: "Masuk - GiziMeal",
  description: "Masuk ke akun GiziMeal untuk mengakses fitur deteksi bahan dan rekomendasi menu gizi seimbang.",
};

export default function Page() {
  return <LoginPage />;
}
