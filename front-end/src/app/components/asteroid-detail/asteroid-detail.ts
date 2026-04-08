import { Component, input, output, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Asteroid } from '../../models/asteroid';
import { formatDistance, formatVelocity } from '../asteroid-table/asteroid-table';

const icons = {
  ruler: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/></svg>`,
  gauge: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  orbit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)"/><circle cx="12" cy="12" r="2"/></svg>`,
  shieldAlert: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  targetLg: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
};

export interface DetailRow {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-asteroid-detail',
  templateUrl: './asteroid-detail.html',
  styleUrl: './asteroid-detail.scss',
})
export class AsteroidDetail {
  asteroid = input.required<Asteroid | null>();
  close = output<void>();

  private sanitizer = inject(DomSanitizer);

  safeIcon(svg: string) {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  targetLgIcon = this.sanitizer.bypassSecurityTrustHtml(icons.targetLg);
  xIcon = this.sanitizer.bypassSecurityTrustHtml(icons.x);

  rows = computed<DetailRow[]>(() => {
    const asteroid = this.asteroid();
    if (!asteroid) return [];
    return [
      {
        icon: icons.ruler,
        label: 'Diameter',
        value: `${asteroid.diameter_min_km.toFixed(3)} – ${asteroid.diameter_max_km.toFixed(3)} km`,
      },
      { icon: icons.gauge, label: 'Velocity', value: formatVelocity(asteroid.velocity_kmph) },
      {
        icon: icons.target,
        label: 'Miss Distance',
        value: formatDistance(asteroid.miss_distance_km),
      },
      {
        icon: icons.calendar,
        label: 'Approach Date',
        value: new Date(asteroid.approach_date).toLocaleDateString(),
      },
      {
        icon: icons.shieldAlert,
        label: 'Abs. Magnitude',
        value: `${asteroid.absolute_magnitude} H`,
      },
    ];
  });

  riskText = computed(() => {
    const risk = this.asteroid()?.risk;
    if (risk === 'Danger')
      return 'High collision probability detected. Object exhibits close approach trajectory combined with significant velocity and estimated diameter. Continuous monitoring recommended.';
    if (risk === 'Caution')
      return 'Moderate risk parameters identified. One or more factors (proximity, speed, size) exceed nominal thresholds. Observation window flagged for tracking.';
    return 'All parameters within safe margins. Object trajectory poses no significant threat during current approach window.';
  });

  onClose(): void {
    this.close.emit();
  }
}
