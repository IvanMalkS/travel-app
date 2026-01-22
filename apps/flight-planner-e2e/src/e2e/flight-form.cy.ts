describe('Flight Form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should submit valid flight', () => {
    cy.addFlight(
      'Новосибирск',
      'Москва',
      '2026-01-10',
      '19:00',
      '2026-01-10',
      '19:30',
    );

    cy.get('[data-testid="flight"]').should('have.length', 1);
  });
});
