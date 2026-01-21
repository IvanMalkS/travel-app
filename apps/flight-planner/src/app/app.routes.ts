import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@travel-app/flight-search').then(
        (flightSearch) => flightSearch.FlightContainerComponent,
      ),
  },
];
