import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FoodItem } from "@/lib/types";
import { NUTRIENT_LABELS } from "@/lib/constants";

const cols = Object.keys(NUTRIENT_LABELS) as Array<keyof typeof NUTRIENT_LABELS>;

export function NutritionTable({ items, startIndex = 0 }: { items: FoodItem[]; startIndex?: number }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">No</TableHead>
            <TableHead>Food Items</TableHead>
            {cols.map((c) => (
              <TableHead key={c} className="font-mono text-xs whitespace-nowrap">{NUTRIENT_LABELS[c]}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it, i) => (
            <TableRow key={`${it["Food Items"]}-${i}`}>
              <TableCell className="text-center text-xs text-muted-foreground">{startIndex + i + 1}</TableCell>
              <TableCell className="max-w-xs truncate">{it["Food Items"]}</TableCell>
              {cols.map((c) => (
                <TableCell key={c} className="font-mono text-xs">{(it[c] as string | number) ?? "-"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
