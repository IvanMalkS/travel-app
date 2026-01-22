import './commands';

beforeEach(() => {
  cy.clearLocalStorage();
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = `
      * {
        transition: none !important;
        animation: none !important;
      }
    `;
    doc.head.appendChild(style);
  });
});
