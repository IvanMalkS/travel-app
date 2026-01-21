import { Component, computed, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { v4 as uuidv4 } from 'uuid';
import { Airport, AIRPORTS, Flight } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-flight-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './flight-form.component.html',
  styleUrl: './flight-form.component.scss',
})
export class FlightFormComponent {
  readonly add = output<Flight>();

  protected readonly airports = AIRPORTS;
  protected readonly hours = this.generateHours();

  private readonly fb = inject(FormBuilder);

  private generateHours(): string[] {
    const hours: string[] = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i.toString().padStart(2, '0'));
    }
    return hours;
  }

  protected readonly form = this.fb.group({
    origin: [null as Airport | null, Validators.required],
    destination: [null as Airport | null, Validators.required],
    date: [new Date(), Validators.required],
    depTime: ['12', Validators.required],
    arrTime: ['14', Validators.required],
  });

  private readonly selectedOrigin = toSignal(
    this.form.controls.origin.valueChanges,
    {
      initialValue: this.form.controls.origin.value,
    },
  );

  protected readonly destinationAirports = computed(() => {
    const origin = this.selectedOrigin();

    if (!origin) {
      return this.airports;
    }

    return this.airports.filter((airport) => airport.code !== origin.code);
  });

  constructor() {
    this.form.controls.origin.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((origin) => {
        const currentDest = this.form.controls.destination.value;
        if (origin && currentDest && origin.code === currentDest.code) {
          this.form.controls.destination.reset();
        }
      });
  }

  protected submit(): void {
    if (this.form.invalid) return;

    const val = this.form.getRawValue();

    if (
      !val.date ||
      !val.depTime ||
      !val.arrTime ||
      !val.origin ||
      !val.destination
    ) {
      return;
    }

    const date = val.date;

    const departureTime = new Date(date);
    departureTime.setHours(+val.depTime);

    const arrivalTime = new Date(date);
    arrivalTime.setHours(+val.arrTime);

    if (arrivalTime <= departureTime) {
      arrivalTime.setDate(arrivalTime.getDate() + 1);
    }

    const flight: Flight = {
      id: uuidv4(),
      origin: val.origin,
      destination: val.destination,
      departureTime,
      arrivalTime,
    };

    this.add.emit(flight);

    this.form.patchValue({ origin: val.destination, destination: null });
  }
}
