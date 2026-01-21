import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { v4 as uuidv4 } from 'uuid';
import { Airport, AIRPORTS, Flight } from '../models';

@Component({
  selector: 'lib-flight-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group(
    {
      origin: [null as Airport | null, Validators.required],
      destination: [null as Airport | null, Validators.required],
      depDate: [new Date(), Validators.required],
      depTime: ['12:00', Validators.required],
      arrDate: [new Date(), Validators.required],
      arrTime: ['14:30', Validators.required],
    },
    {
      validators: [arrivalTimeValidator],
    },
  );

  private readonly selectedOrigin = toSignal(
    this.form.controls.origin.valueChanges,
    {
      initialValue: this.form.controls.origin.value,
    },
  );

  protected readonly minArrivalDate = toSignal(
    this.form.controls.depDate.valueChanges,
    {
      initialValue: this.form.controls.depDate.value,
    },
  );

  protected readonly destinationAirports = computed(() => {
    const origin = this.selectedOrigin();
    if (!origin) return this.airports;
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

    this.form.controls.depDate.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((date) => {
        if (date) {
          this.form.controls.arrDate.setValue(date);
        }
      });
  }

  protected submit(): void {
    if (this.form.invalid) return;

    const val = this.form.getRawValue();

    if (
      !val.depDate ||
      !val.depTime ||
      !val.arrDate ||
      !val.arrTime ||
      !val.origin ||
      !val.destination
    ) {
      return;
    }

    const departureTime = this.setTime(new Date(val.depDate), val.depTime);
    const arrivalTime = this.setTime(new Date(val.arrDate), val.arrTime);

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

    this.form.patchValue({
      origin: val.destination,
      destination: null,
      depDate: val.arrDate,
      arrDate: val.arrDate,
    });
  }

  private setTime(date: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours || 0, minutes || 0, 0, 0);
    return newDate;
  }
}

export const arrivalTimeValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const val = group.getRawValue();

  if (!val.depDate || !val.depTime || !val.arrDate || !val.arrTime) {
    return null;
  }

  const [depHours, depMinutes] = val.depTime.split(':').map(Number);
  const [arrHours, arrMinutes] = val.arrTime.split(':').map(Number);

  const dep = new Date(val.depDate);
  dep.setHours(depHours, depMinutes);

  const arr = new Date(val.arrDate);
  arr.setHours(arrHours, arrMinutes);

  if (arr <= dep) {
    return { arrivalInvalid: true };
  }

  return null;
};
