import { Flight } from './flight.interface';

export interface Segment {
  flights: Flight[];
  totalDuration?: string;
}
