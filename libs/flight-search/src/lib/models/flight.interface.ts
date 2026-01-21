import { Airport } from './airport.interface';

export interface Flight {
  id: string;
  origin: Airport;
  destination: Airport;
  departureTime: Date;
  arrivalTime: Date;
}

export type FlightRawFromJson = Omit<
  Flight,
  'departureTime' | 'arrivalTime'
> & {
  departureTime: string;
  arrivalTime: string;
};
