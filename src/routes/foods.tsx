import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, ChevronLeft, ChevronRight, Database, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { MedicalDisclaimer } from "@/components/common/MedicalDisclaimer";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { FadeUp } from "@/components/common/MotionWrapper";
import { NutritionTable } from "@/components/foods/NutritionTable";
import { getFoods, searchFoods } from "@/lib/api";
import type { FoodItem } from "@/lib/types";

export const Route = createFileRoute("/foods")({
  component: FoodsPage,
  head: () => ({
    meta: [
      { title: "Database Nutrisi - GiziMeal" },
      {
        name: "description",
        content:
          "Cari informasi gizi makanan berdasarkan nama menu atau bahan, dengan dataset awal dari Kaggle yang diverifikasi ulang menggunakan acuan AKG dan Pedoman Gizi Seimbang.",
      },
    ],
  }),
});

const SUGGESTIONS = ["chicken", "rice", "egg", "apple", "potato", "fish"];

type SortKey = "default" | "kcal-asc" | "kcal-desc" | "protein-desc" | "fibre-desc";
const SORTS: { value: SortKey; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "kcal-asc", label: "Kalori ↑" },
  { value: "kcal-desc", label: "Kalori ↓" },
  { value: "protein-desc", label: "Protein tinggi" },
  { value: "fibre-desc", label: "Serat tinggi" },
];

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : -Infinity;
}

function FoodsPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("default");
  const [page, setPage] = useState(1);
  const reqRef = useRef(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const id = ++reqRef.current;
    setLoading(true);
    setError(null);
    const run =
      debounced.length >= 2
        ? searchFoods(debounced).then((r) => r.results)
        : getFoods().then((r) => r.data);
    run
      .then((data) => {
        if (id !== reqRef.current) return;
        setItems(data ?? []);
      })
      .catch((e) => {
        if (id !== reqRef.current) return;
        setError(e instanceof Error ? e.message : "Permintaan gagal.");
        setItems([]);
      })
      .finally(() => {
        if (id === reqRef.current) setLoading(false);
      });
  }, [debounced]);

  const showSearchHint = useMemo(
    () => query.length > 0 && query.trim().length < 2,
    [query],
  );

  const sortedItems = useMemo(() => {
    if (sort === "default") return items;
    const arr = [...items];
    const cmp: Record<Exclude<SortKey, "default">, (a: FoodItem, b: FoodItem) => number> = {
      "kcal-asc": (a, b) => num(a["Energy kcal"]) - num(b["Energy kcal"]),
      "kcal-desc": (a, b) => num(b["Energy kcal"]) - num(a["Energy kcal"]),
      "protein-desc": (a, b) => num(b["Protein(g)"]) - num(a["Protein(g)"]),
      "fibre-desc": (a, b) => num(b["Fibre(g)"]) - num(a["Fibre(g)"]),
    };
    arr.sort(cmp[sort]);
    return arr;
  }, [items, sort]);

  // Reset page when data or sort changes
  useEffect(() => { setPage(1); }, [sortedItems]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / ITEMS_PER_PAGE));
  const paginatedItems = sortedItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1200px] px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 md:pt-20 md:pb-16">
          <PageHeader
            eyebrow="Database Gizi"
            title="Komposisi gizi bahan pangan."
            lead="Pencarian informasi nutrisi dengan dataset awal dari Kaggle yang diverifikasi ulang menggunakan acuan AKG dan Pedoman Gizi Seimbang Kemenkes RI."
          />

          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari makanan, contoh: chicken, rice…"
                className="h-11 rounded-xl border-border bg-background pl-10 text-[15px] shadow-sm"
                aria-label="Cari makanan"
              />
            </div>
            {showSearchHint ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Ketik minimal 2 karakter untuk mencari.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span className="mr-1">Coba:</span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-border bg-background px-2.5 py-0.5 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <FadeUp className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 md:py-16">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database className="h-3.5 w-3.5 text-primary" />
              {loading ? (
                <span>Memuat data…</span>
              ) : (
                <span>
                  Menampilkan{" "}
                  <span className="font-semibold text-foreground tnum">
                    {sortedItems.length}
                  </span>{" "}
                  item{debounced.length >= 2 ? ` untuk "${debounced}"` : ""}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpDown className="h-3 w-3" /> Urutkan:
              </span>
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={[
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    sort === s.value
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <ErrorAlert message={error} />
          ) : items.length === 0 ? (
            <EmptyState
              title="Tidak ada hasil"
              description="Coba kata kunci lain seperti 'rice', 'apple', atau 'egg'."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <NutritionTable items={paginatedItems} startIndex={(page - 1) * ITEMS_PER_PAGE} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Halaman {page} dari {totalPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {generatePageNumbers(page, totalPages).map((p, i) =>
                      p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-xs text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={p}
                          variant={page === p ? "default" : "outline"}
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setPage(p as number)}
                        >
                          {p}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="mt-10">
            <MedicalDisclaimer compact />
          </div>
        </FadeUp>
      </section>
    </>
  );
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
}
