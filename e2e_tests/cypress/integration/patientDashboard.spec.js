describe('Patient Dashboard Page', () => {

  it('Patient View', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('test.user.two@gmail.com');
    cy.get('input[type="password"]').type('usertwopassword');
    cy.contains('Submit').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Logged in Successfully');
    cy.contains('My Dashboard');
    cy.contains('My Information');
 
    cy.get('select').should('contain', 'All Data').within(() => {
      cy.get('option').should('contain', 'By Day')
        .should('contain', 'By Month')
        .should('contain', 'By Year');
    });

    cy.get('select').should('contain', 'Fluid Intake Over Time').within(() => 
      cy.get('option').should('contain', 'Energy Intake Over Time'
    ));
      cy.contains('Show Weight');

    cy.contains('Logout');
  });

  it('My Information', () => {
    cy.contains('My Information').click();
    cy.url().should('include', '/patientInfo/2');
    cy.contains('Patient Name: Test User Two');
    cy.contains('Email Address: test.user.two@gmail.com');
    cy.contains('Gender: Male');
    cy.contains('Weight');
    cy.contains('Treatment History');
    cy.get('table').contains('Treatment Plan Description');
    cy.get('table').contains('Target Fluid (mL)');
    cy.get('table').contains('Target Energy (kcal)');
    cy.get('table').contains('Modified On');
    cy.get('button').should('contain', 'Change Weight');
    cy.contains('Change Weight').click();
    cy.contains('Cancel').click();
  });

  it('Info -> Dashboard', () => {
    cy.contains('Back').click();
    cy.url().should('include', '/dashboard');
  });

  it ('Logout', () => {
    cy.contains('Logged in Successfully').click(); // to get rid of the toast
    cy.contains('Logout').click();
    cy.contains('Logged out Successfully');
    cy.url().should('include', '/login');
  })
})