import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Flight, FlightRawFromJson, Segment } from '../../models';
import { StorageService } from '../storage-service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly storage = inject(StorageService);
  private readonly STORAGE_KEY = 'flight_data';

  private readonly _flights = signal<Flight[]>([]);

  readonly flights = this._flights.asReadonly();
  readonly segments = computed(() => this.buildSegments(this._flights()));

  constructor() {
    this.initFromStorage();

    effect(() => {
      this.storage.setItem(this.STORAGE_KEY, this._flights());
    });
  }

  addFlight(flight: Flight): void {
    this._flights.update((current) => {
      const newList = [...current, flight];
      return newList.sort(
        (a, b) => a.departureTime.getTime() - b.departureTime.getTime(),
      );
    });
  }

  removeFlight(id: string): void {
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

  private initFromStorage(): void {
    const rawData = this.storage.getItem<FlightRawFromJson[]>(this.STORAGE_KEY);

    if (!rawData) return;

    const parsedFlights: Flight[] = rawData.map((flight) => ({
      ...flight,
      departureTime: new Date(flight.departureTime),
      arrivalTime: new Date(flight.arrivalTime),
    }));

    this._flights.set(parsedFlights);
  }
}
