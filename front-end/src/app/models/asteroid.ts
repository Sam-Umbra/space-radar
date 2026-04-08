export type AsteroidRisk = 'Safe' | 'Caution' | 'Danger';

export interface Asteroid {
  id: string;
  name: string;
  diameter_min_km: number;
  diameter_max_km: number;
  velocity_kmph: number;
  miss_distance_km: number;
  risk: AsteroidRisk;
  absolute_magnitude: number;
  approach_date: Date;
  confidence_score: number;
}