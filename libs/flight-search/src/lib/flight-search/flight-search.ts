import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-flight-search',
  imports: [],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearch {}
