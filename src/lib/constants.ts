export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_API_BASE_URL as string | undefined) ||
  "https://cc26-psu393-gizimeal-api.hf.space";

export const MAX_FILES = 15;
export const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
export const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB
export const ALLOWED_MIME = ["image/jpeg", "image/png"];
export const ALLOWED_EXT = [".jpg", ".jpeg", ".png"];

export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Tidak/jarang olahraga" },
  { value: "light", label: "Olahraga ringan 1-3 hari/minggu" },
  { value: "moderate", label: "Olahraga sedang 3-5 hari/minggu" },
  { value: "active", label: "Olahraga berat 6-7 hari/minggu" },
  { value: "very_active", label: "Olahraga sangat berat / pekerjaan fisik" },
] as const;

export const NUTRIENT_LABELS: Record<string, string> = {
  "Energy kcal": "Energi (kcal)",
  "Carbs": "Karbohidrat (g)",
  "Protein(g)": "Protein (g)",
  "Fat(g)": "Lemak (g)",
  "Fibre(g)": "Serat (g)",
  "Calcium(mg)": "Kalsium (mg)",
};
