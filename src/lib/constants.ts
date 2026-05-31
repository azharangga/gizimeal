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
  Carbs: "Karbohidrat (g)",
  "Protein(g)": "Protein (g)",
  "Fat(g)": "Lemak (g)",
  "Fibre(g)": "Serat (g)",
  "Calcium(mg)": "Kalsium (mg)",
  score_akg: "Skor AKG",
  "Iron(mg)": "Zat Besi (mg)",
  "Zinc(mg)": "Seng (mg)",
  "Vit A(mcg)": "Vit A (mcg)",
  "Vit B1(mg)": "Vit B1 (mg)",
  "Vit B2(mg)": "Vit B2 (mg)",
  "Vit B3(mg)": "Vit B3 (mg)",
  "Vit C(mg)": "Vit C (mg)",
  "Sodium(mg)": "Natrium (mg)",
  "Potassium(mg)": "Kalium (mg)",
  "Cholesterol(mg)": "Kolesterol (mg)",
  "Sugar(g)": "Gula (g)",
  "Water(g)": "Air (g)",
};
