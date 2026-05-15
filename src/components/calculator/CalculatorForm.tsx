import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ACTIVITY_LEVELS } from "@/lib/constants";
import type { BMRRequest } from "@/lib/types";

const schema = z.object({
  age: z.coerce.number().int().positive("Usia harus lebih dari 0"),
  weight: z.coerce.number().positive("Berat harus lebih dari 0"),
  height: z.coerce.number().positive("Tinggi harus lebih dari 0"),
  gender: z.enum(["male", "female"]),
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
});

export type CalculatorFormValues = z.infer<typeof schema>;

export function CalculatorForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: BMRRequest) => void;
  loading: boolean;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CalculatorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 25,
      weight: 70,
      height: 170,
      gender: "male",
      activity_level: "sedentary",
    },
  });

  const gender = watch("gender");
  const activity = watch("activity_level");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="age">Usia</Label>
          <Input id="age" type="number" inputMode="numeric" {...register("age")} />
          {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight">Berat badan (kg)</Label>
          <Input id="weight" type="number" step="0.1" {...register("weight")} />
          {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="height">Tinggi badan (cm)</Label>
          <Input id="height" type="number" step="0.1" {...register("height")} />
          {errors.height && <p className="text-xs text-destructive">{errors.height.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Jenis kelamin</Label>
          <Select value={gender} onValueChange={(v) => setValue("gender", v as "male" | "female")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Laki-laki</SelectItem>
              <SelectItem value="female">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Level aktivitas</Label>
          <Select
            value={activity}
            onValueChange={(v) => setValue("activity_level", v as CalculatorFormValues["activity_level"])}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTIVITY_LEVELS.map((a) => (
                <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] sm:w-auto"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Hitung Kebutuhan Kalori
      </Button>
    </form>
  );
}
