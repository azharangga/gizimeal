import type { Metadata } from "next";
import { AccountPage } from "@/components/pages/account-page";

export const metadata: Metadata = {
  title: "Kelola Akun - GiziMeal",
  description: "Perbarui informasi profil, ubah password, atau hapus akun.",
};

export default function Page() {
  return <AccountPage />;
}
