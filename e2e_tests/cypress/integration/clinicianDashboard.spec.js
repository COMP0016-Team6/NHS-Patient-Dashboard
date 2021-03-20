describe('Clinician Dashboard Page', () => {
  it('Clinician View', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('test.user.one@gmail.com');
    cy.get('input[type="password"]').type('useronepassword');
    cy.contains('Submit').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Logged in Successfully');
    cy.contains('Welcome, Clinician Test User One');
    cy.contains('My Patients');
    cy.contains('Test User Two');
    cy.contains('Test User Three');
    cy.contains('Add Patients');
    cy.contains('Logout');
  });

  it('Add Patients', () => {
    cy.contains('Add Patients').click();
    cy.contains('Add Patients');
    cy.get('h3').should('contain', 'Test User Two').get('input[type="checkbox"]');
    cy.get('h3').should('contain', 'Test User Three').get('input[type="checkbox"]');
  })
  
  it ('Logout', () => {
    cy.contains('Logged in Successfully').click(); // to get rid of the toast
    cy.contains('Logout').click();
    cy.contains('Logged out Successfully');
    cy.url().should('include', '/login');
  })
});