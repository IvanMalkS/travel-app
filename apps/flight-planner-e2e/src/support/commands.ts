/// <reference types="cypress" />

Cypress.Commands.add(
  'addFlight',
  (from, to, depDate, depTime, arrDate, arrTime) => {
    cy.get('[data-testid="from"]').click();
    cy.get('.cdk-overlay-pane mat-option').contains(from).click();

    cy.get('[data-testid="to"]').click();
    cy.get('.cdk-overlay-pane mat-option').contains(to).click();

    cy.get('[data-testid="departure-date"]').clear();
    cy.get('[data-testid="departure-date"]').type(depDate);

    cy.get('[data-testid="departure-time"]').clear();
    cy.get('[data-testid="departure-time"]').type(depTime);

    cy.get('[data-testid="arrival-date"]').clear();
    cy.get('[data-testid="arrival-date"]').type(arrDate);

    cy.get('[data-testid="arrival-time"]').clear();
    cy.get('[data-testid="arrival-time"]').type(arrTime);

    cy.get('[data-testid="submit-flight"]').click();
  },
);
