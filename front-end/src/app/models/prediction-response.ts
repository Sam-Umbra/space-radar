export interface PredictionResponse {
  id: number;
  name: string;
  is_hazardous: boolean;
  confidence_score: number;
  status: string;
  est_diameter_min: number;
  est_diameter_max: number;
  relative_velocity: number;
  miss_distance: number;
  absolute_magnitude: number;
  approach_date: Date
}