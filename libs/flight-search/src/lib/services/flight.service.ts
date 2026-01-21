import {
  Injectable,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Flight, FlightRawFromJson, Segment } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly platformId = inject(PLATFORM_ID);
  private _flights = signal<Flight[]>([]);

  readonly flights = this._flights.asReadonly();
  readonly segments = computed(() => this.buildSegments(this._flights()));

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.saveToStorage(this._flights());
      }
    });
  }

  addFlight(flight: Flight) {
    this._flights.update((current) => {
      const newList = [...current, flight];
      return newList.sort(
        (a, b) => a.departureTime.getTime() - b.departureTime.getTime(),
      );
    });
  }

  removeFlight(id: string) {
    this._flights.update((list) => list.filter((flight) => flight.id !== id));
  }

  private buildSegments(flights: Flight[]): Segment[] {
    if (flights.length === 0) return [];

    const segments: Segment[] = [];
    let currentSegment: Flight[] = [flights[0]];

    for (let i = 1; i < flights.length; i++) {
      const prev = currentSegment[currentSegment.length - 1];
      const curr = flights[i];

      const isConnected =
        prev.destination.code === curr.origin.code &&
        curr.departureTime.getTime() >= prev.arrivalTime.getTime();

      if (isConnected) {
        currentSegment.push(curr);
      } else {
        segments.push({ flights: [...currentSegment] });
        currentSegment = [curr];
      }
    }

    segments.push({ flights: currentSegment });

    return segments;
  }

  private saveToStorage(flights: Flight[]) {
    try {
      localStorage.setItem('flight_data', JSON.stringify(flights));
    } catch (e) {
      console.error('Ошибка сохранения в LocalStorage', e);
    }
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('flight_data');
    if (saved) {
      try {
        const rawData = JSON.parse(saved) as FlightRawFromJson[];

        const parsed = rawData.map((flight) => ({
          ...flight,
          departureTime: new Date(flight.departureTime),
          arrivalTime: new Date(flight.arrivalTime),
        }));

        this._flights.set(parsed);
      } catch (e) {
        console.error('Ошибка загрузки из LocalStorage', e);
      }
    }
  }
}
