"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Check,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Save,
  Shield,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarCropModal } from "@/components/common/AvatarCropModal";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(60, "Nama terlalu panjang")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' .\-]+$/, "Nama hanya boleh huruf, spasi, titik, dan tanda hubung"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password terlalu panjang")
      .regex(/[a-z]/, "Harus memuat huruf kecil")
      .regex(/[A-Z]/, "Harus memuat huruf besar")
      .regex(/[0-9]/, "Harus memuat angka")
      .regex(/[^A-Za-z0-9]/, "Harus memuat simbol"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Konfirmasi password tidak cocok",
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
    defaultValues: { name: "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { currentPassword: "", password: "", confirm: "" },
  });

  const pwd = passwordForm.watch("password") ?? "";
  const confirm = passwordForm.watch("confirm") ?? "";

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

  useEffect(() => {
    if (user?.name) {
      profileForm.reset({ name: user.name });
    }
  }, [user?.name, profileForm]);

  const onSaveProfile = async (data: ProfileValues) => {
    setSavingProfile(true);
    const tId = toast.loading("Menyimpan perubahan...");
    const { error } = await supabase.auth.updateUser({
      data: { name: data.name },
    });

    // Sync to profiles table
    await supabase
      .from("profiles")
      .update({ name: data.name })
      .eq("id", user!.id);

    if (error) {
      toast.error("Gagal menyimpan", { id: tId, description: error.message });
    } else {
      toast.success("Profil berhasil diperbarui", { id: tId });
    }
    setSavingProfile(false);
  };

  const onUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Format file harus JPG atau PNG");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Read file and open crop modal
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropConfirm = async (croppedBlob: Blob) => {
    setUploadingAvatar(true);
    const tId = toast.loading("Mengupload foto...");

    try {
      // Compress the cropped image
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: "image/jpeg",
      });

      const filePath = `${user!.id}/${user!.name.replace(/\s+/g, "-").toLowerCase()}-${crypto.randomUUID().slice(0, 8)}.jpg`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressed, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (uploadError) {
        toast.error("Gagal upload foto", { id: tId, description: uploadError.message });
        setUploadingAvatar(false);
        setShowCropModal(false);
        return;
      }

      // Get public URL with cache buster
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      // Update profiles table
      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user!.id);

      if (updateError) {
        toast.error("Gagal menyimpan foto", { id: tId, description: updateError.message });
      } else {
        toast.success("Foto profil berhasil diperbarui", { id: tId });
      }
    } catch {
      toast.error("Gagal memproses gambar", { id: tId });
    }

    setUploadingAvatar(false);
    setShowCropModal(false);
    setCropImageSrc(null);
  };

  const onDeleteAvatar = async () => {
    setUploadingAvatar(true);
    const tId = toast.loading("Menghapus foto...");
    try {
      // List and delete all avatar files for this user
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(user!.id);

      if (files && files.length > 0) {
        const paths = files.map((f) => `${user!.id}/${f.name}`);
        await supabase.storage.from("avatars").remove(paths);
      }

      // Remove avatar_url from user metadata
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });

      // Set avatar_url to null in profiles table
      await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user!.id);

      if (error) {
        toast.error("Gagal menghapus foto", { id: tId, description: error.message });
      } else {
        toast.success("Foto profil dihapus", { id: tId });
      }
    } catch {
      toast.error("Gagal menghapus foto", { id: tId });
    }
    setUploadingAvatar(false);
  };

  const onChangePassword = async (data: PasswordValues) => {
    setSavingPassword(true);
    const tId = toast.loading("Mengubah password...");
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: data.currentPassword,
    });
    if (verifyError) {
      toast.error("Password lama salah", { id: tId });
      setSavingPassword(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    if (error) {
      toast.error("Gagal mengubah password", { id: tId, description: error.message });
    } else {
      toast.success("Password berhasil diubah", { id: tId });
      passwordForm.reset();
      await logout();
      router.push("/login");
      router.refresh();
    }
    setSavingPassword(false);
  };

  const onDeleteAccount = async () => {
    setDeleting(true);
    const tId = toast.loading("Menghapus akun...");
    try {
      const res = await fetch("/api/auth/delete", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Gagal menghapus akun", { id: tId, description: data.error });
        setDeleting(false);
        return;
      }
      await logout();
      toast.success("Akun berhasil dihapus", { id: tId });
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Gagal menghapus akun", { id: tId });
      setDeleting(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <>
        {/* Header skeleton — matches the actual header section */}
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-4xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-9 w-48 sm:h-10 sm:w-56 md:h-12 md:w-64" />
            <Skeleton className="mt-4 h-4 w-72 sm:w-96" />
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
          {/* Profile section skeleton */}
          <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-8 py-8 border-b border-border">
            <div className="mb-4 md:mb-0 space-y-1.5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="space-y-5">
              {/* Avatar skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-5">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
              {/* Name field skeleton */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Email field skeleton */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-3 w-36" />
              </div>
              {/* Button skeleton */}
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>

          {/* Password section skeleton */}
          <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-8 py-8 border-b border-border">
            <div className="mb-4 md:mb-0 space-y-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-44" />
            </div>
            <div className="space-y-4">
              {/* Current password */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* New password */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Confirm password */}
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Button */}
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>

          {/* Delete account section skeleton */}
          <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-8 py-8">
            <div className="mb-4 md:mb-0 space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </>
    );
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      {/* Header section */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Pengaturan
            </p>
            <h1 className="mt-3 font-semibold text-[28px] leading-[1.1] tracking-tight sm:text-[34px] md:text-[44px]">
              Kelola Akun
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
              Perbarui informasi profil, ubah password, atau hapus akun kamu.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        {/* ─── Profile Section ─── */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.06 }}>
          <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-8 py-8 border-b border-border first:pt-0">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm font-semibold">Profil</h2>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Informasi dasar akun yang ditampilkan di aplikasi.
              </p>
            </div>

            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-5">
              {/* Avatar */}
              <div className="space-y-2">
                <Label className="text-sm">Foto Profil</Label>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => user?.avatarUrl ? setShowPhotoModal(true) : fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-border transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-foreground text-xl font-semibold">
                        {initials}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {user?.avatarUrl ? (
                        <Eye className="h-5 w-5 text-white" />
                      ) : (
                        <Camera className="h-5 w-5 text-white" />
                      )}
                    </div>
                    {/* Loading overlay */}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    )}
                  </button>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                      >
                        <Camera className="mr-1.5 h-3 w-3" />
                        {user?.avatarUrl ? "Ganti Foto" : "Upload Foto"}
                      </Button>
                      {user?.avatarUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={onDeleteAvatar}
                          disabled={uploadingAvatar}
                        >
                          <Trash2 className="mr-1.5 h-3 w-3" />
                          Hapus
                        </Button>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      JPG atau PNG. Maks 2MB.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={onUploadAvatar}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="text-sm">Nama</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="profile-name"
                    placeholder="Nama lengkap"
                    className="h-10 pl-10"
                    aria-invalid={!!profileForm.formState.errors.name}
                    {...profileForm.register("name")}
                  />
                </div>
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                  <Input
                    value={user?.email ?? ""}
                    disabled
                    className="h-10 pl-10 opacity-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Email tidak dapat diubah.</p>
              </div>

              <div>
                <Button type="submit" disabled={savingProfile} size="sm" className="h-9">
                  {savingProfile ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-3.5 w-3.5" />
                  )}
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ─── Password Section ─── */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.12 }}>
          <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-8 py-8 border-b border-border">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm font-semibold">Password</h2>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Ubah password untuk menjaga keamanan akun.
              </p>
            </div>

            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              {/* Current password */}
              <div className="space-y-1.5">
                <Label htmlFor="current-password" className="text-sm">Password saat ini</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password lama"
                    className="h-10 pl-10 pr-10"
                    aria-invalid={!!passwordForm.formState.errors.currentPassword}
                    {...passwordForm.register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    aria-label={showCurrentPassword ? "Sembunyikan" : "Tampilkan"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-sm">Password baru</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Buat password yang kuat"
                    className="h-10 pl-10 pr-10"
                    aria-invalid={!!passwordForm.formState.errors.password}
                    {...passwordForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Strength meter */}
                {pwd.length > 0 && (
                  <div className="mt-2.5 space-y-2">
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
                      <span className="w-20 text-right text-[11px] font-semibold text-muted-foreground">
                        {strength.label}
                      </span>
                    </div>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] sm:grid-cols-3">
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
                )}

                {passwordForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{passwordForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm">Konfirmasi password baru</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ulangi password baru"
                    className="h-10 pl-10 pr-10"
                    aria-invalid={!!passwordForm.formState.errors.confirm || (confirm.length > 0 && pwd !== confirm)}
                    {...passwordForm.register("confirm")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? "Sembunyikan" : "Tampilkan"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirm.length > 0 && pwd === confirm && !passwordForm.formState.errors.confirm && (
                  <p className="flex items-center gap-1 text-xs text-foreground">
                    <Check className="h-3 w-3 text-primary" /> Password cocok
                  </p>
                )}
                {confirm.length > 0 && pwd !== confirm && !passwordForm.formState.errors.confirm && (
                  <p className="flex items-center gap-1 text-xs text-destructive">
                    <X className="h-3 w-3" /> Password tidak cocok
                  </p>
                )}
                {passwordForm.formState.errors.confirm && (
                  <p className="text-xs text-destructive">{passwordForm.formState.errors.confirm.message}</p>
                )}
              </div>

              <div>
                <Button type="submit" disabled={savingPassword} size="sm" className="h-9 bg-amber-500 text-white hover:bg-amber-600">
                  {savingPassword ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Shield className="mr-2 h-3.5 w-3.5" />
                  )}
                  Ubah Password
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ─── Delete Account Section ─── */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.18 }}>
          <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-8 py-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm font-semibold">Hapus Akun</h2>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                Tindakan ini permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Setelah akun dihapus, semua data termasuk riwayat aktivitas akan hilang secara permanen. Pastikan kamu sudah menyimpan informasi yang diperlukan sebelum melanjutkan.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Hapus Akun Saya
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus akun secara permanen?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Semua data akun kamu akan dihapus dan tidak dapat dipulihkan. Apakah kamu yakin ingin melanjutkan?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteAccount}
                      disabled={deleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Ya, Hapus Akun
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Photo Preview Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-md p-2 sm:max-w-lg">
          <DialogTitle className="sr-only">Foto Profil</DialogTitle>
          {user?.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Crop Modal */}
      {cropImageSrc && (
        <AvatarCropModal
          open={showCropModal}
          imageSrc={cropImageSrc}
          onClose={() => {
            setShowCropModal(false);
            setCropImageSrc(null);
          }}
          onConfirm={onCropConfirm}
          loading={uploadingAvatar}
        />
      )}
    </>
  );
}
