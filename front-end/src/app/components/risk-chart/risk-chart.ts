import { Component, computed, input } from '@angular/core';
import { Asteroid } from '../../models/asteroid';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

const COLORS = {
  Safe: 'hsl(193, 100%, 50%)',
  Caution: 'hsl(36, 100%, 50%)',
  Danger: 'hsl(0, 85%, 55%)',
};

@Component({
  selector: 'app-risk-chart',
  imports: [BaseChartDirective],
  templateUrl: './risk-chart.html',
  styleUrl: './risk-chart.scss',
})
export class RiskChart {
  asteroids = input.required<Asteroid[]>();

  segments = computed(() => {
    const all = this.asteroids();
    return (['Safe', 'Caution', 'Danger'] as const)
      .map((risk) => ({ name: risk, value: all.filter((a) => a.risk === risk).length }))
      .filter((d) => d.value > 0);
  });

  chartData = computed<ChartData<'doughnut'>>(() => {
    const segs = this.segments();
    return {
      labels: segs.map((s) => s.name),
      datasets: [
        {
          data: segs.map((s) => s.value),
          backgroundColor: segs.map((s) => COLORS[s.name]),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  });

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'hsl(228, 40%, 10%)',
        borderColor: 'hsl(228, 30%, 20%)',
        borderWidth: 1,
        titleFont: { family: "'Space Mono', monospace", size: 12 },
        bodyFont: { family: "'Space Mono', monospace", size: 12 },
        titleColor: 'hsl(210, 40%, 92%)',
        bodyColor: 'hsl(210, 40%, 92%)',
        padding: 10,
      },
    },
  };
}
