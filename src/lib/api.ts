import type {
  HealthResponse,
  PredictionResponse,
  FoodsListResponse,
  FoodsSearchResponse,
  ClassesResponse,
  BMRRequest,
  BMRResponse,
} from "@/lib/types";

async function handleApiError(response: Response): Promise<never> {
  let detail = "";
  try {
    const data = await response.json();
    detail = data?.detail || data?.message || data?.error || "";
  } catch {
    /* ignore */
  }
  throw new Error(detail || `Permintaan gagal (${response.status})`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, init);
  } catch {
    throw new Error("Gagal terhubung ke server. Coba beberapa saat lagi.");
  }
  if (!res.ok) await handleApiError(res);
  return (await res.json()) as T;
}

export function checkHealth() {
  return request<HealthResponse>("/health");
}

export function predictFoods(files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  return request<PredictionResponse>("/predict", {
    method: "POST",
    body: formData,
  });
}

export function getFoods(limit?: number) {
  const params = limit ? `?limit=${limit}` : "";
  return request<FoodsListResponse>(`/foods${params}`);
}

export function searchFoods(query: string) {
  return request<FoodsSearchResponse>(
    `/foods/search?query=${encodeURIComponent(query)}`,
  );
}

export function getClasses() {
  return request<ClassesResponse>("/classes");
}

export function calculateBMR(data: BMRRequest) {
  return request<BMRResponse>("/calculator/bmr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
