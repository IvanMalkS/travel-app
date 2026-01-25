import { InjectionToken } from '@angular/core';
import { AIRPORTS } from '../const/airports.const';
import { Airport } from '../models';

export const AIRPORTS_TOKEN = new InjectionToken<ReadonlyArray<Airport>>(
  'AIRPORTS_TOKEN',
  {
    providedIn: 'root',
    factory: () => AIRPORTS,
  },
);
