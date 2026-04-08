import { Injectable, signal } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Asteroid } from '../models/asteroid';
import { PredictionResponse } from '../models/prediction-response';
import { mapPredictionToAsteroid } from '../helpers/asteroid.mapper';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client: Client;
  private mockInterval: ReturnType<typeof setInterval> | null = null;
  private isConnected = false;

  public responses = signal<Asteroid[]>([]);

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws-radar',
      reconnectDelay: 5000,
      onConnect: () => {
        this.isConnected = true;
        this.stopMockData();
        this.client.subscribe('/radar/prediction', (message) => {
          const raw: PredictionResponse = JSON.parse(message.body);
          const asteroid = mapPredictionToAsteroid(raw);
          this.responses.update((prev) => [...prev, asteroid]);
        });
      },
      onDisconnect: () => {
        this.isConnected = false;
        this.startMockData();
      },
      onStompError: () => {
        if (!this.isConnected) this.startMockData();
      },
      onWebSocketError: () => {
        if (!this.isConnected) this.startMockData();
      },
    });

    this.client.activate();

    setTimeout(() => {
      if (!this.isConnected) this.startMockData();
    }, 10000);
  }

  private startMockData(): void {
    if (this.mockInterval !== null) return;
    console.warn('[WebsocketService] No connection — using mock data');
    this.responses.set(this.generateMockAsteroids(8));
    this.mockInterval = setInterval(() => {
      const newAsteroid = this.generateMockAsteroid(Date.now());
      this.responses.update((prev) => [...prev, newAsteroid]);
    }, 2500);
  }

  private stopMockData(): void {
    if (this.mockInterval === null) return;
    clearInterval(this.mockInterval);
    this.mockInterval = null;
    this.responses.set([]);
    console.info('[WebsocketService] Real connection established — mock data cleared');
  }

  private generateMockAsteroids(count: number): Asteroid[] {
    return Array.from({ length: count }, (_, i) =>
      this.generateMockAsteroid(Date.now() - i * 3000),
    );
  }

  private generateMockAsteroid(seed: number): Asteroid {
    const rng = this.seededRandom(seed);
    const id = String(Math.floor(rng() * 900_000) + 100_000);
    const isHazardous = rng() < 0.3;
    const confidence = rng();
    const miss = rng() * 70_000_000 + 50_000;
    const velMin = 10_000;
    const velMax = 120_000;

    let risk: Asteroid['risk'];
    if (isHazardous && confidence >= 0.7) risk = 'Danger';
    else if (isHazardous || confidence >= 0.4) risk = 'Caution';
    else risk = 'Safe';

    const approachDate = new Date();
    approachDate.setDate(approachDate.getDate() + Math.floor(rng() * 365));

    return {
      id,
      name: `NEO ${id}`,
      diameter_min_km: parseFloat((rng() * 0.8 + 0.05).toFixed(4)),
      diameter_max_km: parseFloat((rng() * 1.5 + 0.9).toFixed(4)),
      velocity_kmph: parseFloat((rng() * (velMax - velMin) + velMin).toFixed(1)),
      miss_distance_km: parseFloat(miss.toFixed(2)),
      absolute_magnitude: parseFloat((rng() * 10 + 15).toFixed(1)), // typical range 15–25 H
      approach_date: approachDate,
      confidence_score: parseFloat(confidence.toFixed(4)),
      risk,
    };
  }

  private seededRandom(seed: number): () => number {
    let s = seed % 2_147_483_647;
    if (s <= 0) s += 2_147_483_646;
    return () => {
      s = (s * 16_807) % 2_147_483_647;
      return (s - 1) / 2_147_483_646;
    };
  }
}
