import { ROUTE_1, ROUTE_2 } from '../fixtures/routes';

describe('Route Segmentation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should build complex routes from flights', () => {
    ROUTE_1.forEach((f) => cy.addFlight(...f));
    ROUTE_2.forEach((f) => cy.addFlight(...f));

    cy.get('[data-testid="segment-list"]')
      .find('[data-testid="segment"]')
      .should('have.length', 2);

    cy.get('[data-testid="segment"]')
      .eq(0)
      .should('contain.text', 'Новосибирск')
      .and('contain.text', 'Москва')
      .and('contain.text', 'Стамбул');

    cy.get('[data-testid="segment"]')
      .eq(1)
      .should('contain.text', 'Москва')
      .and('contain.text', 'Новосибирск');
  });

  it('should not merge flights with invalid time connection', () => {
    cy.addFlight(
      'Новосибирск',
      'Москва',
      '2026-01-10',
      '19:00',
      '2026-01-10',
      '19:30',
    );

    cy.addFlight(
      'Москва',
      'Стамбул',
      '2026-01-10',
      '19:00',
      '2026-01-10',
      '23:50',
    );

    cy.get('[data-testid="segment"]').should('have.length', 2);
  });
});
