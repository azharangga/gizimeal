import type { PredictionResponse, MenuRecommendation } from "@/lib/types";

const KEY = "gizimeal:lastPrediction";

export function slugifyMenu(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function savePrediction(data: PredictionResponse) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function loadPrediction(): PredictionResponse | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PredictionResponse;
  } catch {
    return null;
  }
}

export function clearPrediction() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function findMenuBySlug(
  data: PredictionResponse | null,
  slug: string,
): MenuRecommendation | null {
  if (!data?.menu_recommendations) return null;
  return (
    data.menu_recommendations.find((m) => slugifyMenu(m.menu_name) === slug) ??
    null
  );
}