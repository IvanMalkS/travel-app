import { Flight } from './flight.interface';

export interface Segment {
  flights: Flight[];
  totalDurationFormated?: string;
  totalDurationMs?: number;
}
