describe('Flight List', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add and remove flight', () => {
    cy.addFlight(
      'Новосибирск',
      'Москва',
      '2026-01-10',
      '19:00',
      '2026-01-10',
      '19:30',
    );

    cy.get('[data-testid="flight"]').should('have.length', 1);

    cy.get('[data-testid="flight"]')
      .first()
      .within(() => {
        cy.get('[data-testid="delete-flight"]').click();
      });

    cy.get('[data-testid="flight"]').should('have.length', 0);
  });
});
