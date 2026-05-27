"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";
import { useMemo, useState } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { Turnstile } from "react-turnstile";

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter")
      .max(60, "Nama terlalu panjang")
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' .-]+$/, "Nama hanya boleh huruf, spasi, tanda petik, titik, dan tanda hubung"),
    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid")
      .max(255, "Email terlalu panjang"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password terlalu panjang")
      .regex(/[a-z]/, "Password harus memuat huruf kecil")
      .regex(/[A-Z]/, "Password harus memuat huruf besar")
      .regex(/[0-9]/, "Password harus memuat angka")
      .regex(/[^A-Za-z0-9]/, "Password harus memuat simbol"),
    confirm: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Kamu harus menyetujui ketentuan" }),
    }),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Konfirmasi password tidak cocok",
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirm: "", terms: false as unknown as true },
  });

  const pwd = watch("password") ?? "";
  const confirm = watch("confirm") ?? "";
  const terms = watch("terms");

  const checks = useMemo(
    () => [
      { id: "len", label: "Minimal 8 karakter", ok: pwd.length >= 8 },
      { id: "lower", label: "Huruf kecil (a-z)", ok: /[a-z]/.test(pwd) },
      { id: "upper", label: "Huruf besar (A-Z)", ok: /[A-Z]/.test(pwd) },
      { id: "num", label: "Angka (0-9)", ok: /[0-9]/.test(pwd) },
      { id: "sym", label: "Simbol (!@#$..)", ok: /[^A-Za-z0-9]/.test(pwd) },
    ],
    [pwd],
  );
  const score = checks.filter((c) => c.ok).length;
  const strength =
    pwd.length === 0
      ? { label: "—", color: "bg-border" }
      : score <= 1
        ? { label: "Lemah", color: "bg-destructive" }
        : score <= 2
          ? { label: "Cukup", color: "bg-amber-500" }
          : score <= 3
            ? { label: "Baik", color: "bg-primary/70" }
            : score === 4
              ? { label: "Kuat", color: "bg-primary/80" }
              : { label: "Sangat Kuat", color: "bg-primary" };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const { error } = await registerUser(data.name, data.email, data.password);
    if (error) {
      toast.error("Gagal membuat akun", { description: error });
      setLoading(false);
      return;
    }
    toast.success("Akun berhasil dibuat", {
      description: `Selamat datang, ${data.name}!`,
    });
    setLoading(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <AuthBrandPanel />

      <main className="relative flex min-h-screen flex-col overflow-y-auto bg-background lg:max-h-screen">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Buat Akun
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[34px]">
                Mulai perjalanan gizimu.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Daftar gratis untuk mulai menggunakan fitur GiziMeal.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit, () =>
                toast.error("Periksa kembali isian formulir"),
              )}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama lengkap</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder="Masukkan nama lengkap"
                    aria-invalid={!!errors.name}
                    className="h-11 pl-10"
                    {...register("name")}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="kamu@gmail.com"
                    aria-invalid={!!errors.email}
                    className="h-11 pl-10"
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Buat password yang kuat"
                    aria-invalid={!!errors.password}
                    className="h-11 pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Strength meter */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-1.5 flex-1 gap-1 overflow-hidden">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-full flex-1 rounded-full transition-colors ${
                            i < score ? strength.color : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="w-12 text-right text-[11px] font-semibold text-muted-foreground">
                      {strength.label}
                    </span>
                  </div>
                  <ul className="grid grid-cols-2 gap-1 text-[11px]">
                    {checks.map((c) => (
                      <li
                        key={c.id}
                        className={`flex items-center gap-1.5 ${
                          c.ok ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {c.ok ? (
                          <Check className="h-3 w-3 text-primary" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {c.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm">Konfirmasi password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    aria-invalid={!!errors.confirm || (confirm.length > 0 && pwd !== confirm)}
                    className="h-11 pl-10 pr-10"
                    {...register("confirm")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirm.length > 0 && pwd === confirm && !errors.confirm && (
                  <p className="flex items-center gap-1 text-xs text-primary">
                    <Check className="h-3 w-3" /> Password cocok
                  </p>
                )}
                {confirm.length > 0 && pwd !== confirm && !errors.confirm && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <X className="h-3 w-3" /> Password tidak cocok
                  </p>
                )}
                {errors.confirm && (
                  <p className="text-xs text-destructive">{errors.confirm.message}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground select-none">
                <Checkbox
                  checked={terms === true}
                  onCheckedChange={(c) => setValue("terms", (c === true) as true, { shouldValidate: true })}
                  className="mt-0.5"
                />
                <span className="leading-snug">
                  Saya menyetujui{" "}
                  <Link href="/about" className="font-semibold text-foreground underline underline-offset-4">
                    ketentuan layanan
                  </Link>{" "}
                  dan kebijakan privasi GiziMeal.
                </span>
              </label>
              {errors.terms && (
                <p className="-mt-2 text-xs text-destructive">{errors.terms.message as string}</p>
              )}

              <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onVerify={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                theme="auto"
                appearance="always"
                size="flexible"
              />

              <Button
                type="submit"
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
                disabled={loading || !turnstileToken}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses…
                  </>
                ) : (
                  <>
                    Buat Akun
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-foreground underline underline-offset-4">
                Masuk
              </Link>
            </p>
          </motion.div>
        </div>

        <p className="px-6 pb-6 text-center text-[11px] text-muted-foreground sm:px-10">
          © {new Date().getFullYear()} GiziMeal. All rights reserved.
        </p>
      </main>
    </div>
  );
}
