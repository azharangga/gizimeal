import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
