import { Card, CardContent } from "@/components/ui/card";
import type { FoodItem } from "@/lib/types";
import { NUTRIENT_LABELS } from "@/lib/constants";

export function NutritionCard({ item }: { item: FoodItem }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-semibold">{item["Food Items"]}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {Object.entries(NUTRIENT_LABELS).map(([key, label]) => (
            <div key={key} className="rounded-md border border-border-soft bg-[var(--surface-alt)] p-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-0.5 font-mono text-xs">{(item[key] as string | number) ?? "-"}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
