import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Flight, FlightRawFromJson } from '../../models';
import { StorageService } from '../storage-service/storage.service';
import { buildSegments } from '../../utils/flight-calculation/flight-calculations.util';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly storage = inject(StorageService);
  private readonly STORAGE_KEY = 'flight_data';

  private readonly _flights = signal<Flight[]>([]);

  readonly flights = this._flights.asReadonly();
  readonly segments = computed(() => buildSegments(this._flights()));

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
