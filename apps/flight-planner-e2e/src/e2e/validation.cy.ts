describe('Flight Form Validation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should prevent arrival before departure', () => {
    cy.get('.desktop-grid').should('be.visible');

    cy.get('[data-testid="from"] .mat-mdc-select-trigger')
      .should('be.visible')
      .click({ force: true });

    cy.get('mat-option').contains('Новосибирск').click();

    cy.get('[data-testid="to"]').click();

    cy.get('mat-option').contains('Москва').click();

    cy.get('[data-testid="departure-date"]').type('2026-01-10');
    cy.get('[data-testid="departure-time"]').type('20:00');

    cy.get('[data-testid="arrival-date"]').type('2026-01-10');
    cy.get('[data-testid="arrival-time"]').type('19:00');

    cy.get('[data-testid="submit-flight"]').should('be.disabled');
  });
});
