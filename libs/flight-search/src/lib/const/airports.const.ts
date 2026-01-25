import { Airport } from '../models/airport.interface';

export const AIRPORTS = [
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
] as const satisfies Airport[];
