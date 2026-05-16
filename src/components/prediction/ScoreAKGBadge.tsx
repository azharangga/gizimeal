export function ScoreAKGBadge({ score }: { score: number }) {
  const v = Math.round(score);
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold tabular-nums text-foreground">
      <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">AKG</span>
      <span className="text-sm font-semibold">{v}</span>
    </div>
  );
}
