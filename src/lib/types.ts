export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  dataset_loaded: boolean;
  active_model?: { filename?: string; format?: string } | null;
  class_names_source?: string;
  total_classes?: number;
  startup_error?: string | null;
}

export interface Nutrients {
  "Energy kcal"?: number | string;
  "Carbs"?: number | string;
  "Protein(g)"?: number | string;
  "Fat(g)"?: number | string;
  "Fibre(g)"?: number | string;
  "Calcium(mg)"?: number | string;
  [k: string]: number | string | undefined;
}

export interface MenuRecommendation {
  rank: number;
  is_best?: boolean;
  menu_name: string;
  matched_ingredients: string[];
  score_akg: number;
  explanation?: string;
  nutrients: Nutrients;
}

export interface SinglePrediction {
  detected_item: string;
  class_id?: number;
  confidence_score: number;
  confidence_percent: string;
  predicted_kcal: number;
}

export interface PredictionItem {
  filename: string;
  detected_item?: string;
  class_id?: number;
  confidence_score?: number;
  confidence_percent?: string;
  predicted_kcal?: number;
  error?: string;
}

export interface PredictionSingleResponse {
  success: boolean;
  mode: "single";
  filename: string;
  prediction: SinglePrediction;
  menu_recommendations: MenuRecommendation[];
}

export interface PredictionMultiResponse {
  success: boolean;
  mode: "multi";
  total_images: number;
  total_processed: number;
  detected_ingredients: string[];
  per_image_predictions: PredictionItem[];
  menu_recommendations: MenuRecommendation[];
}

export type PredictionResponse = PredictionSingleResponse | PredictionMultiResponse;

export interface FoodItem {
  "Food Items": string;
  "Energy kcal"?: number | string;
  "Carbs"?: number | string;
  "Protein(g)"?: number | string;
  "Fat(g)"?: number | string;
  "Fibre(g)"?: number | string;
  "Calcium(mg)"?: number | string;
  [k: string]: number | string | undefined;
}

export interface FoodsListResponse {
  success: boolean;
  total_items: number;
  returned: number;
  data: FoodItem[];
}

export interface FoodsSearchResponse {
  success: boolean;
  query: string;
  total_matches: number;
  results: FoodItem[];
}

export interface ClassesResponse {
  success: boolean;
  total_classes: number;
  source: string;
  classes: string[];
}

export type Gender = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface BMRRequest {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity_level: ActivityLevel;
}

export interface BMRResponse {
  success: boolean;
  input: BMRRequest;
  results: {
    bmr_kcal: number;
    tdee_kcal: number;
    units: string;
  };
  calorie_goals: {
    weight_loss: number;
    maintenance: number;
    weight_gain: number;
  };
  activity_multiplier: number;
}
