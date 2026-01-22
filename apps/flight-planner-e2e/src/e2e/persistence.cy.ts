describe('Persistence', () => {
  it('keeps flights after reload', () => {
    cy.visit('/');

    cy.addFlight(
      'Новосибирск',
      'Москва',
      '2026-01-10',
      '19:00',
      '2026-01-10',
      '19:30',
    );

    cy.reload();

    cy.get('[data-testid="flight-list"]:visible').within(() => {
      cy.get('[data-testid="flight"]').should('have.length', 1);
    });
  });
});
