import { Activity, Apple, CheckCircle2, Utensils } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-border bg-[var(--dark-panel)] p-1 shadow-xl">
        <div className="rounded-xl bg-[var(--dark-panel-soft)] p-5 text-white">
          {/* window header */}
          <div className="mb-4 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 font-mono text-[11px] text-white/50">POST /predict</span>
          </div>

          {/* detected ingredients */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">
              detected ingredients
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["Chicken", "Potato", "Carrot"].map((i) => (
                <span
                  key={i}
                  className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/90 ring-1 ring-white/10"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>

          {/* confidence + kcal */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Activity className="h-3 w-3" /> confidence
              </div>
              <p className="mt-1 font-mono text-lg text-primary">98.76%</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Apple className="h-3 w-3" /> predicted kcal
              </div>
              <p className="mt-1 font-mono text-lg">250.5</p>
            </div>
          </div>

          {/* recommendation */}
          <div className="mt-3 rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Utensils className="h-3 w-3" /> rekomendasi menu
              </div>
              <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                Terbaik
              </span>
            </div>
            <p className="mt-1.5 text-sm">Sup Ayam Sayur</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-white/50">
              <CheckCircle2 className="h-3 w-3 text-primary" /> Score AKG 78, Sangat Baik
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
