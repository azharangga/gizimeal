"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getClasses } from "@/lib/api";

// Hardcoded fallback — 15 kelas yang didukung saat ini
const FALLBACK_CLASSES = [
  "bawang merah",
  "bawang putih",
  "cabai",
  "daging ayam",
  "daging sapi",
  "ikan",
  "jagung",
  "kangkung",
  "kentang",
  "kubis",
  "telur",
  "tempe",
  "tahu",
  "tomat",
  "wortel",
];

export function ClassesGrid() {
  const [classes, setClasses] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getClasses()
      .then((res) => {
        if (alive && res.classes?.length) {
          setClasses(res.classes);
        } else if (alive) {
          setClasses(FALLBACK_CLASSES);
        }
      })
      .catch(() => {
        if (alive) setClasses(FALLBACK_CLASSES);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Skeleton berbentuk badge supaya posisi & bentuknya sama
  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {FALLBACK_CLASSES.map((c) => (
          <Skeleton key={c} className="h-6 rounded-md" style={{ width: `${c.length * 8 + 16}px` }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(classes ?? FALLBACK_CLASSES).map((c) => (
        <Badge key={c} variant="outline" className="border-border bg-card capitalize text-foreground">
          {c}
        </Badge>
      ))}
    </div>
  );
}
