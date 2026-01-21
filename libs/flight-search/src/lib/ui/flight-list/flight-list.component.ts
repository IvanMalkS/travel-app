import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Flight } from '../../models';

@Component({
  selector: 'lib-flight-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
})
export class FlightListComponent {
  flights = input.required<Flight[]>();
  delete = output<string>();
}
