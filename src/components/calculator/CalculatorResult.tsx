import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { BMRResponse } from "@/lib/types";

function fmt(n: number) {
  return Math.round(n).toLocaleString("id-ID");
}

export function CalculatorResult({ data }: { data: BMRResponse }) {
  const items = [
    { label: "BMR", value: data.results.bmr_kcal, hint: "Kebutuhan kalori dasar" },
    { label: "TDEE", value: data.results.tdee_kcal, hint: `Aktivitas ×${data.activity_multiplier}` },
  ];
  const goals = [
    { label: "Penurunan berat", value: data.calorie_goals.weight_loss },
    { label: "Pemeliharaan", value: data.calorie_goals.maintenance },
    { label: "Penambahan berat", value: data.calorie_goals.weight_gain },
  ];

  // Distribusi makro mengikuti AMDR (Acceptable Macronutrient Distribution Range)
  // Karbo 50%, Protein 20%, Lemak 30% dari TDEE.
  const tdee = data.results.tdee_kcal;
  const macros = [
    { label: "Karbohidrat", pct: 50, kcalPerG: 4, color: "var(--color-chart-1)" },
    { label: "Protein", pct: 20, kcalPerG: 4, color: "var(--color-chart-3)" },
    { label: "Lemak", pct: 30, kcalPerG: 9, color: "var(--color-chart-4)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <Card key={it.label}>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{it.label}</p>
              <p className="mt-2 font-mono text-2xl">{fmt(it.value)} <span className="text-sm text-muted-foreground">kcal/hari</span></p>
              <p className="mt-1 text-xs text-muted-foreground">{it.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Distribusi Makronutrien (AMDR)
          </p>
          <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            {macros.map((m) => (
              <div
                key={m.label}
                style={{ width: `${m.pct}%`, background: m.color }}
                aria-label={`${m.label} ${m.pct}%`}
              />
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {macros.map((m) => {
              const kcal = (tdee * m.pct) / 100;
              const grams = kcal / m.kcalPerG;
              return (
                <div
                  key={m.label}
                  className="rounded-md border border-border-soft bg-[var(--surface-alt)] p-3"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: m.color }}
                    />
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                  <p className="mt-1 font-mono text-base">
                    {fmt(grams)} <span className="text-xs text-muted-foreground">g</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.pct}% · {fmt(kcal)} kcal
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Target Kalori</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {goals.map((g) => (
              <div key={g.label} className="rounded-md border border-border-soft bg-[var(--surface-alt)] p-3">
                <p className="text-xs text-muted-foreground">{g.label}</p>
                <p className="mt-1 font-mono text-lg">{fmt(g.value)}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Hasil bersifat informatif dan tidak digunakan sebagai acuan medis.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
