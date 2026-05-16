"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { ImagePlus, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import {
  ALLOWED_EXT,
  ALLOWED_MIME,
  MAX_FILE_SIZE,
  MAX_FILES,
  MAX_TOTAL_SIZE,
} from "@/lib/constants";

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export function FileUpload({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndAdd = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const errs: string[] = [];
      const accepted: File[] = [];

      for (const f of list) {
        const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
        if (!ALLOWED_MIME.includes(f.type) || !ALLOWED_EXT.includes(ext)) {
          errs.push(`${f.name}: format harus JPG/PNG.`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          errs.push(`${f.name}: melebihi 1 MB.`);
          continue;
        }
        accepted.push(f);
      }

      const merged = [...files, ...accepted];
      if (merged.length > MAX_FILES) {
        errs.push(`Maksimum ${MAX_FILES} gambar.`);
      }
      const limited = merged.slice(0, MAX_FILES);
      const total = limited.reduce((s, f) => s + f.size, 0);
      if (total > MAX_TOTAL_SIZE) {
        errs.push("Total ukuran melebihi 15 MB.");
        setError(errs.join(" "));
        return;
      }

      setError(errs.length ? errs.join(" ") : null);
      onChange(limited);
    },
    [files, onChange],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) validateAndAdd(e.dataTransfer.files);
  };

  const remove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onChange(next);
    if (next.length === 0) setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Unggah gambar"
        className={[
          "relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors duration-150 select-none",
          dragOver
            ? "border-foreground/30 bg-secondary/60"
            : "border-border hover:border-foreground/20 hover:bg-secondary/40",
        ].join(" ")}
      >
        <div className="mx-auto flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Tarik gambar ke sini atau{" "}
              <span className="text-primary underline underline-offset-2">pilih file</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG atau PNG · Maks. 1 MB per file · Maks. 15 gambar
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png"
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (e.target.files) validateAndAdd(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && <ErrorAlert title="File tidak valid" message={error} />}

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {files.map((f, i) => {
            const url = URL.createObjectURL(f);
            return (
              <div
                key={`${f.name}-${i}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={f.name}
                  className="aspect-square w-full object-cover"
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label={`Hapus ${f.name}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-background/90 opacity-0 ring-1 ring-border/60 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                {/* File info overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-[10px] font-medium text-white">{f.name}</p>
                  <p className="text-[9px] text-white/70">{formatBytes(f.size)}</p>
                </div>
                {/* Index badge */}
                <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-md bg-background/80 text-[10px] font-semibold text-foreground ring-1 ring-border/40">
                  {i + 1}
                </span>
              </div>
            );
          })}

          {/* Add more tile */}
          {files.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-secondary/40"
            >
              <FileImage className="h-5 w-5" />
              <span className="text-[10px]">Tambah</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
