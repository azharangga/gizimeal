"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChefHat,
  Clock,
  ImageIcon,
  Loader2,
  ScanLine,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { AuthLockedState } from "@/components/common/AuthGate";
import { useAuth } from "@/lib/auth";

interface DetectedItem {
  name: string;
  confidence: number;
}

interface HistoryItem {
  id: string;
  mode: "single" | "multi";
  detected_items: DetectedItem[];
  total_images: number;
  menu_recommendations: { menu_name: string; score_akg: number }[];
  created_at: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, fetchHistory]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const tId = toast.loading("Menghapus riwayat...");
    try {
      const res = await fetch(`/api/history?id=${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setHistory((h) => h.filter((item) => item.id !== deleteId));
        toast.success("Riwayat dihapus", { id: tId });
      } else {
        toast.error("Gagal menghapus", { id: tId });
      }
    } catch {
      toast.error("Gagal menghapus", { id: tId });
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelative = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return formatDate(dateStr);
  };

  // Loading skeleton
  if (authLoading) {
    return (
      <>
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-4xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-9 w-64 sm:h-10" />
            <Skeleton className="mt-4 h-4 w-80" />
          </div>
        </section>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="space-y-3">
            <div className="mb-6">
              <Skeleton className="h-4 w-32" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="hidden sm:block h-10 w-10 rounded-lg" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-24 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                    <div className="flex gap-4 pt-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <PageHeader
            eyebrow="Riwayat"
            title="Riwayat deteksi bahan makanan."
            lead="Catatan hasil deteksi dan rekomendasi menu yang pernah kamu lakukan."
          />
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
          {!isAuthenticated ? (
            <AuthLockedState
              title="Masuk untuk Melihat Riwayat"
              description="Riwayat deteksi bahan makanan hanya tersedia untuk pengguna yang sudah masuk."
            />
          ) : loading ? (
            <div className="space-y-3">
              <div className="mb-6 flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="hidden sm:block h-10 w-10 rounded-lg" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <div className="flex gap-1.5">
                        <Skeleton className="h-5 w-20 rounded-md" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                      </div>
                      <div className="flex gap-4 pt-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            /* Empty state */
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 px-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <ScanLine className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-5 text-base font-semibold">Belum ada riwayat deteksi</h3>
              <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                Riwayat akan muncul di sini setelah kamu menggunakan fitur Deteksi Bahan untuk menganalisis foto makanan.
              </p>
              <Button asChild size="sm" className="mt-6 h-9">
                <Link href="/predict">
                  Mulai Deteksi
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            /* History list */
            <div className="space-y-3">
              {/* Summary */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {history.length} deteksi tercatat
                </p>
              </div>

              {history.map((item, i) => (
                <motion.div
                  key={item.id}
                  {...fadeUp}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card cursor-pointer transition-all hover:border-border/80 hover:shadow-sm"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      {/* Left number */}
                      <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <span className="text-sm font-semibold text-muted-foreground">{i + 1}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Detected items */}
                        <p className="text-sm font-medium text-foreground">
                          {item.detected_items.length > 0
                            ? item.detected_items
                                .map((d) => d.name.charAt(0).toUpperCase() + d.name.slice(1))
                                .join(", ")
                            : "Tidak terdeteksi"}
                        </p>

                        {/* Menu recommendations */}
                        {item.menu_recommendations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.menu_recommendations.slice(0, 3).map((menu) => (
                              <span
                                key={menu.menu_name}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                              >
                                <ChefHat className="h-2.5 w-2.5" />
                                {menu.menu_name}
                              </span>
                            ))}
                            {item.menu_recommendations.length > 3 && (
                              <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                +{item.menu_recommendations.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meta info */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatRelative(item.created_at)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}, {formatTime(item.created_at)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {item.total_images} {item.total_images > 1 ? "foto" : "foto"}
                          </span>
                        </div>
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      <Dialog open={!!selectedItem} onOpenChange={(v) => !v && setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Deteksi</DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selectedItem.created_at)}, {formatTime(selectedItem.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {selectedItem.total_images} foto
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-5 mt-2">
              {/* Detected items */}
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Bahan Terdeteksi
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.detected_items.length > 0 ? (
                    selectedItem.detected_items.map((item) => (
                      <span
                        key={item.name}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm font-medium"
                      >
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          ({Math.round(item.confidence * 100)}%)
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Tidak ada bahan terdeteksi</span>
                  )}
                </div>
              </div>

              {/* Menu recommendations */}
              {selectedItem.menu_recommendations.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Rekomendasi Menu
                  </p>
                  <div className="space-y-2">
                    {selectedItem.menu_recommendations.map((menu, idx) => (
                      <div
                        key={menu.menu_name}
                        className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium">{menu.menu_name}</span>
                        </div>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {Math.round(menu.score_akg)} AKG
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus riwayat ini?</DialogTitle>
            <DialogDescription>
              Data riwayat deteksi ini akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)} disabled={deleting}>
              Batal
            </Button>
            <Button
              size="sm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-2 h-3.5 w-3.5" />}
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
