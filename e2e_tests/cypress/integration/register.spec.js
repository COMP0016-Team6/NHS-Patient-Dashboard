describe('Register Page', () => {
  const adminPassword = Cypress.env("adminPassword");

  it('Test register route', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type("admin@admin.com");
    cy.get('input[type="password"]').type(adminPassword);
    cy.contains('Submit').click();
    cy.url().should('include', '/register');
  });

  it('Register page contents - patient view', () => {
    cy.contains('Register');
    cy.contains('Submit');
    cy.contains('Logout From Admin');
    cy.contains('Clear Fields');

    cy.get('form')
      .should('contain', 'email *')
      .should('contain', 'password *')
      .should('contain', 'confirm password *')
      .should('contain', 'full name *');

    cy.get('select').should('contain', 'Patient').within(() => cy.get('option').should('contain', 'Clinician'));

    cy.get('select').should('contain', 'Male').within(() => cy.get('option').should('contain', 'Female'));

    cy.get('input[placeholder="Date of Birth *"]');
    cy.get('input[name="weight"]').click();
    cy.get('textarea[name="diagnosis"]').click();
    cy.get('input[name="description"]').click();
    cy.get('input[name="targetFluid"]').click();
    cy.get('input[name="targetEnergy"]').click();
  })

  it('Missing Fields', () => {
    cy.contains('Submit').click();
    cy.contains('Missing Fields');
  });

  it('Logout', () => {
    cy.contains('Logout From Admin').click();
    cy.contains('Logged out Successfully');
    cy.url().should('include', '/login');
  });
});