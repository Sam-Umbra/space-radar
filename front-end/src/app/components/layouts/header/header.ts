import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  formattedDate = signal('');
  formattedTime = signal('');
  timezone = "UTC" + (-(new Date().getTimezoneOffset() / 60));
  private interval?: ReturnType<typeof setInterval>;

  private update(): void {
    const now = new Date();
    this.formattedDate.set(
      now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }),
    );

    this.formattedTime.set(now.toLocaleTimeString('en-US', { hour12: false }));
  }

  ngOnInit(): void {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
