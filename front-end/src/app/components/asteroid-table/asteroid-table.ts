import { Component, input, output } from '@angular/core';
import { Asteroid } from '../../models/asteroid';

export function formatDistance(km: number): string {
  if (km >= 1_000_000) return (km / 1_000_000).toFixed(2) + ' M km';
  if (km >= 1_000) return (km / 1_000).toFixed(1) + ' k km';
  return km.toFixed(0) + ' km';
}

export function formatVelocity(kmph: number): string {
  return kmph.toFixed(1) + ' km/h';
}

@Component({
  selector: 'app-asteroid-table',
  imports: [],
  templateUrl: './asteroid-table.html',
  styleUrl: './asteroid-table.scss',
})
export class AsteroidTable {
  asteroids = input<Asteroid[]>();
  selectedId = input<string | null>(null);
  asteroidSelect = output<Asteroid>();
  formatDistance = formatDistance;
  formatVelocity = formatVelocity;

  onSelect(asteroid: Asteroid): void {
    this.asteroidSelect.emit(asteroid);
  }
}
