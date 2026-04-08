export type NeoRisk = 'Safe' | 'Caution' | 'Danger';

export interface Asteroid {
  id: string;
  name: string;
  diameter_min_km: number;
  diameter_max_km: number;
  velocity_kmph: number;
  miss_distance_km: number;
  risk: NeoRisk;
}