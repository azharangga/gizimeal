"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getClasses } from "@/lib/api";

export function ClassesGrid() {
  const [classes, setClasses] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getClasses()
      .then((res) => alive && setClasses(res.classes))
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-md" />
        ))}
      </div>
    );
  }

  if (failed || !classes) {
    return (
      <p className="text-sm text-muted-foreground">
        Daftar bahan belum bisa dimuat saat ini.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {classes.map((c) => (
        <Badge key={c} variant="outline" className="border-border bg-card capitalize text-foreground">
          {c}
        </Badge>
      ))}
    </div>
  );
}
