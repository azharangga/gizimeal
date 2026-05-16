"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

const schema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi").email("Format email tidak valid").max(255, "Email terlalu panjang"),
  password: z.string().min(8, "Password minimal 8 karakter").max(72, "Password terlalu panjang"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: true },
  });

  const remember = watch("remember");

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const name = data.email.split("@")[0] || "Pengguna";
    login({ name, email: data.email });
    toast.success("Berhasil masuk", { description: `Selamat datang kembali, ${name}.` });
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <AuthBrandPanel />
      <main className="relative flex min-h-screen flex-col bg-background">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />Kembali ke Beranda
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Masuk Akun</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[34px]">Selamat datang kembali.</h2>
              <p className="mt-2 text-sm text-muted-foreground">Masukkan kredensial untuk melanjutkan ke sistem GiziMeal.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit, () => toast.error("Periksa kembali isian formulir"))} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" autoComplete="email" placeholder="kamu@gmail.com" aria-invalid={!!errors.email} className="h-11 pl-10" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" onClick={() => toast("Fitur lupa password segera hadir", { description: "Hubungi admin untuk reset password." })} className="text-xs text-muted-foreground transition-colors hover:text-foreground">Lupa password?</button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Min. 8 karakter" aria-invalid={!!errors.password} className="h-11 pl-10 pr-10" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
                <Checkbox checked={!!remember} onCheckedChange={(c) => setValue("remember", c === true)} />
                <span>Ingat saya di perangkat ini</span>
              </label>
              <Button type="submit" className="h-11 w-full bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]" disabled={loading}>
                {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memproses…</>) : (<>Masuk Sekarang<ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}<Link href="/register" className="font-semibold text-foreground underline underline-offset-4">Daftar</Link>
            </p>
          </motion.div>
        </div>
        <p className="px-6 pb-6 text-center text-[11px] text-muted-foreground sm:px-10">© {new Date().getFullYear()} GiziMeal. All rights reserved.</p>
      </main>
    </div>
  );
}
