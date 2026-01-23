import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { v4 as uuidv4 } from 'uuid';
import { Airport, Flight } from '../../models';
import { AIRPORTS } from '../../const';

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
      validators: arrivalTimeValidator,
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
    return this.airports.filter((a) => a.code !== origin.code);
  });

  constructor() {
    this.form.controls.origin.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((origin) => {
        const destination = this.form.controls.destination.value;
        if (origin && destination && origin.code === destination.code) {
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { origin, destination, depDate, depTime, arrDate, arrTime } =
      this.form.getRawValue();

    // Под это хотел написать кастомный тайп гуард, но у формы очень много вложенных типов
    if (
      !origin ||
      !destination ||
      !depDate ||
      !depTime ||
      !arrDate ||
      !arrTime
    ) {
      return;
    }

    const departureTime = this.buildDate(depDate, depTime);
    const arrivalTime = this.buildDate(arrDate, arrTime);

    const flight: Flight = {
      /*
       * Как я понял с track история такая же как с Key в реакт
       * и без него производительность падает, а в ангуяре вообще не билдиться
       */
      id: uuidv4(),
      origin,
      destination,
      departureTime,
      arrivalTime,
    };

    this.add.emit(flight);

    this.form.reset({
      depDate: new Date(),
      arrDate: new Date(),
      depTime: '12:00',
      arrTime: '14:30',
    });
  }

  private buildDate(date: Date, time: string): Date {
    const [h, m] = time.split(':').map(Number);
    const result = new Date(date);
    result.setHours(h ?? 0, m ?? 0, 0, 0);
    return result;
  }
}

export const arrivalTimeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const { depDate, depTime, arrDate, arrTime } = control.getRawValue();

  if (!depDate || !depTime || !arrDate || !arrTime) {
    return null;
  }

  const dep = new Date(depDate);
  const arr = new Date(arrDate);

  const [dh, dm] = depTime.split(':').map(Number);
  const [ah, am] = arrTime.split(':').map(Number);

  dep.setHours(dh, dm, 0, 0);
  arr.setHours(ah, am, 0, 0);

  return arr > dep ? null : { arrivalInvalid: true };
};
