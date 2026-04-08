import { Asteroid, AsteroidRisk } from '../models/asteroid';
import { PredictionResponse } from '../models/prediction-response';

export function toAsteroidRisk(response: PredictionResponse): AsteroidRisk {
  if (response.is_hazardous && response.confidence_score >= 0.7) return 'Danger';
  if (response.is_hazardous || response.confidence_score >= 0.4) return 'Caution';
  return 'Safe';
}

export function mapPredictionToAsteroid(response: PredictionResponse): Asteroid {
  return {
    id: String(response.id),
    name: `NEO ${response.name}`,
    diameter_min_km: response.est_diameter_min,
    diameter_max_km: response.est_diameter_max,
    velocity_kmph: response.relative_velocity,
    miss_distance_km: response.miss_distance,
    risk: toAsteroidRisk(response),
    absolute_magnitude: response.absolute_magnitude,
    approach_date: response.approach_date,
    confidence_score: response.confidence_score,
  };
}