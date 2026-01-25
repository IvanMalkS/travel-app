import { InjectionToken } from '@angular/core';
import { FLIGHT_STORAGE_KEY } from '../const';

export const FLIGHT_STORAGE_TOKEN = new InjectionToken<string>(
  'FLIGHT_STORAGE_TOKEN',
  {
    providedIn: 'root',
    factory: () => FLIGHT_STORAGE_KEY,
  },
);
