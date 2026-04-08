import { Injectable, signal } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Asteroid } from '../models/asteroid';
import { Client } from '@stomp/stompjs';
import { PredictionResponse } from '../models/prediction-response';
import { mapPredictionToAsteroid } from '../helpers/asteroid.mapper';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client: Client;
  public responses = signal<Asteroid[]>([]);

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws-radar',
      onConnect: () => {
        this.client.subscribe('/radar/prediction', (message) => {
          const raw: PredictionResponse = JSON.parse(message.body);
          const asteroid = mapPredictionToAsteroid(raw);
          this.responses.update((prev) => [...prev, asteroid]);
        });
      },
    });

    this.client.activate();
  }
}
