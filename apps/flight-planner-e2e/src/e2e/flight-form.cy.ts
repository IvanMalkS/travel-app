describe('Flight Form', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.document().then((doc) => {
      const style = doc.createElement('style');
      style.innerHTML = `
      * {
        transition: none !important;
        animation: none !important;
      }
      /* Убираем плавное открытие меню */
      .mat-mdc-select-panel {
        transition: none !important;
        transform: none !important;
      }
      /* Убираем анимацию всплытия лейбла */
      .mat-mdc-form-field-floating-label {
         transition: none !important;
         animation: none !important;
      }
      /* Скрываем ripple-эффект (волны при клике), он часто блокирует клики */
      .mat-mdc-button-ripple, .mat-ripple {
        display: none !important;
      }
    `;
      doc.head.appendChild(style);
    });
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
