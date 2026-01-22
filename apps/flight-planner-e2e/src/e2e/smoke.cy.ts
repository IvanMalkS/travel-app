describe('Flight Planner – Smoke', () => {
  it('should render main page', () => {
    cy.visit('/');

    cy.get('[data-testid="page-flight-planner"]').should('exist');
    cy.get('[data-testid="flight-form"]').should('be.visible');

    cy.get('[data-testid="flight-list"]:visible').within(() => {
      cy.get('[data-testid="flight"]').should('have.length', 0);
    });

    cy.get('[data-testid="segment-list"]:visible').should('exist');
  });
});
