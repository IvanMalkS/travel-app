/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      addFlight(
        from: string,
        to: string,
        departureDate: string,
        departureTime: string,
        arrivalDate: string,
        arrivalTime: string,
      ): Chainable<void>;
    }
  }
}

export {};
