import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type StatCardColor = 'primary' | 'caution' | 'danger' | 'safe';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  label = input.required<string>();
  value = input.required<string>();
  icon = input.required<string>();
  color = input<StatCardColor>('primary');

  private sanitizer = inject(DomSanitizer);
  safeIcon = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.icon()));
}
