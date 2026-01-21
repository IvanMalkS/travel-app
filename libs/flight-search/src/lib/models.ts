export interface Airport {
  code: string;
  city: string;
}

export interface Flight {
  id: string;
  origin: Airport;
  destination: Airport;
  departureTime: Date;
  arrivalTime: Date;
}

export interface Segment {
  flights: Flight[];
  totalDuration?: string;
}

export const AIRPORTS: Airport[] = [
  { code: 'OVB', city: 'Новосибирск' },
  { code: 'SVO', city: 'Москва' },
  { code: 'IST', city: 'Стамбул' },
  { code: 'DXB', city: 'Дубай' },
  { code: 'JFK', city: 'Нью-Йорк' },
  { code: 'LHR', city: 'Лондон' },
  { code: 'CDG', city: 'Париж' },
  { code: 'AMS', city: 'Амстердам' },
  { code: 'BER', city: 'Берлин' },
  { code: 'BKK', city: 'Бангкок' },
];

export type FlightRawFromJson = Omit<
  Flight,
  'departureTime' | 'arrivalTime'
> & {
  departureTime: string;
  arrivalTime: string;
};
