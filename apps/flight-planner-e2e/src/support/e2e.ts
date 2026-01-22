import './commands';

beforeEach(() => {
  cy.clearLocalStorage();
});

Cypress.on('window:before:load', (win) => {
  const style = win.document.createElement('style');
  style.innerHTML = `
    * {
      transition: none !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }

    .mat-mdc-select-panel,
    .mat-mdc-menu-panel,
    .cdk-overlay-pane {
      transition: none !important;
      transform: none !important;
      animation: none !important;
    }

    .mat-mdc-form-field-floating-label {
      transition: none !important;
      animation: none !important;
    }

    .mat-mdc-button-ripple,
    .mat-ripple {
      display: none !important;
    }
  `;
  win.document.head.appendChild(style);
});
