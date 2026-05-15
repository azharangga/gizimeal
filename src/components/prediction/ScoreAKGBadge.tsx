export function ScoreAKGBadge({ score }: { score: number }) {
  const v = Math.round(score);
  const isStrong = score >= 50;
  return (
    <div
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tabular-nums",
        isStrong
          ? "border-primary/30 bg-primary/8 text-primary"
          : "border-border bg-secondary text-muted-foreground",
      ].join(" ")}
    >
      <span className="text-[9px] uppercase tracking-[0.12em] opacity-70">AKG</span>
      <span className="text-sm font-semibold">{v}</span>
    </div>
  );
}
