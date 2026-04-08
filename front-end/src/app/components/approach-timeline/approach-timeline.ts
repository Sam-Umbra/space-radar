import { Component, computed, input } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Asteroid } from '../../models/asteroid';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-approach-timeline',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './approach-timeline.html',
  styleUrl: './approach-timeline.scss',
})
export class ApproachTimeline {
  asteroids = input.required<Asteroid[]>();

  private todayISO = new Date().toISOString().slice(0, 10);

  private groupedData = computed(() => {
    const allAsteroids = this.asteroids();
    const grouped: Record<string, { date: string; count: number; danger: number }> = {};

    const today = new Date();
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      grouped[key] = { date: key, count: 0, danger: 0 };
    }

    for (const neo of allAsteroids) {
      const dateKey =
        neo.approach_date instanceof Date
          ? neo.approach_date.toISOString().slice(0, 10)
          : String(neo.approach_date).slice(0, 10);

      if (grouped[dateKey]) {
        grouped[dateKey].count++;
        if (neo.risk === 'Danger') {
          grouped[dateKey].danger++;
        }
      }
    }

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  });

  chartData = computed<ChartData<'bar'>>(() => {
    const data = this.groupedData();

    return {
      labels: data.map((d) => d.date),
      datasets: [
        {
          data: data.map((d) => d.count),
          backgroundColor: data.map((d) => {
            const isToday = d.date === this.todayISO;
            return d.danger > 0
              ? `hsl(0, 85%, 55%, ${isToday ? '1.0' : '0.6'})`
              : `hsl(193, 100%, 50%, ${isToday ? '1.0' : '0.6'})`;
          }),
          borderColor: data.map((d) => (d.date === this.todayISO ? 'white' : 'transparent')),
          borderWidth: 2,
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 20,
        },
      ],
    };
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
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
        callbacks: {
          title: (items) => String(items[0].label).slice(5),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: 'hsl(228, 30%, 20%)' },
        ticks: {
          font: { family: "'Space Mono', monospace", size: 11 },
          maxRotation: 0,
          // Customizing the label: Use "TODAY" for the current date
          callback: (value, index, values) => {
            const dateStr = this.groupedData()[index].date;
            return dateStr === this.todayISO ? 'TODAY' : dateStr.slice(5);
          },
          color: (context) => {
            const dateStr = this.groupedData()[context.index]?.date;
            return dateStr === this.todayISO ? 'white' : 'hsl(215, 20%, 55%)';
          },
        },
      },
      y: {
        grid: { color: 'hsl(228, 30%, 20%, 0.4)' },
        border: { display: false },
        ticks: {
          color: 'hsl(215, 20%, 55%)',
          font: { family: "'Space Mono', monospace", size: 11 },
          precision: 0,
          maxTicksLimit: 5,
        },
      },
    },
  };
}
