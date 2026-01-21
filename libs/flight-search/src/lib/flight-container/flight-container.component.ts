import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightFormComponent } from '../flight-form/flight-form.component';
import { FlightListComponent } from '../flight-list/flight-list.component';
import { FlightService } from '../services/flight/flight.service';

@Component({
  selector: 'lib-flight-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FlightFormComponent, FlightListComponent],
  templateUrl: './flight-container.component.html',
  styleUrl: './flight-container.component.scss',
})
export class FlightContainerComponent {
  protected readonly flightService = inject(FlightService);
}
