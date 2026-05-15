import { useCallback, useRef, useState, type DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";
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
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={[
          "rounded-xl border border-dashed p-8 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-[var(--surface-alt)]",
        ].join(" ")}
      >
        <div className="mx-auto flex flex-col items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <UploadCloud className="h-5 w-5 text-foreground" />
          </span>
          <p className="mt-3 text-sm font-semibold">Tarik gambar ke sini atau pilih file</p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG/PNG, maksimal 1 MB per file, maksimal 15 gambar.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => inputRef.current?.click()}
          >
            Pilih gambar
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) validateAndAdd(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {error && <ErrorAlert title="File tidak valid" message={error} />}

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {files.map((f, i) => {
            const url = URL.createObjectURL(f);
            return (
              <div
                key={`${f.name}-${i}`}
                className="group relative overflow-hidden rounded-lg border border-border bg-card"
              >
                <img
                  src={url}
                  alt={f.name}
                  className="h-32 w-full object-cover"
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label={`Hapus ${f.name}`}
                  className="absolute right-1.5 top-1.5 rounded-md bg-background/90 p-1 opacity-0 ring-1 ring-border transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="border-t border-border-soft p-2">
                  <p className="truncate text-xs font-semibold">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">{formatBytes(f.size)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
