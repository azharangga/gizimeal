import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FoodItem } from "@/lib/types";
import { NUTRIENT_LABELS } from "@/lib/constants";

// Ordered list of known nutrient keys (display in this order if present)
const KNOWN_KEYS = Object.keys(NUTRIENT_LABELS);

function getColumns(items: FoodItem[]): string[] {
  if (items.length === 0) return KNOWN_KEYS;

  // Collect all unique keys from data (excluding "Food Items" and internal keys)
  const EXCLUDED_KEYS = new Set(["Food Items", "SearchKey"]);
  const allKeys = new Set<string>();
  for (const item of items) {
    for (const key of Object.keys(item)) {
      if (!EXCLUDED_KEYS.has(key)) allKeys.add(key);
    }
  }

  // Order: known keys first (in defined order), then any extra keys alphabetically
  const ordered: string[] = [];
  for (const k of KNOWN_KEYS) {
    if (allKeys.has(k)) {
      ordered.push(k);
      allKeys.delete(k);
    }
  }
  // Add remaining unknown keys
  const remaining = [...allKeys].sort();
  ordered.push(...remaining);

  return ordered;
}

export function NutritionTable({ items, startIndex = 0 }: { items: FoodItem[]; startIndex?: number }) {
  const cols = getColumns(items);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">No</TableHead>
            <TableHead className="min-w-[180px]">Food Items</TableHead>
            {cols.map((c) => (
              <TableHead key={c} className="font-mono text-xs whitespace-nowrap">
                {NUTRIENT_LABELS[c] || c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it, i) => (
            <TableRow key={`${it["Food Items"]}-${i}`}>
              <TableCell className="text-center text-xs text-muted-foreground">{startIndex + i + 1}</TableCell>
              <TableCell className="max-w-xs truncate font-medium">{it["Food Items"]}</TableCell>
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
