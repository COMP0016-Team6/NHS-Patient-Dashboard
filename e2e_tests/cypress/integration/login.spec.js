/// <reference types='cypress' />

describe('Login Page', () => {
  
  const adminPassword = Cypress.env("adminPassword");

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('Login Page Default Contents', () => {
    cy.contains('Login');
    cy.get('form')
      .should('contain', 'email')
      .should('contain', 'password');
    cy.contains('Submit');
  });

  it('Login Page - Missing Credentials', () => {
    cy.contains('Submit').click();
    cy.contains('Missing Credentials');
  });

  it('Login Page - Missing Credentials 2', () => {
    cy.get('input[name="email"]').type("test");
    cy.contains('Submit').click();
    cy.contains('Missing Credentials');
  });

  it('Login Page - Missing Credentials 2', () => {
    cy.get('input[name="email"]').type("test");
    cy.contains('Submit').click();
    cy.contains('Missing Credentials');
  });

  it('Login Page - Missing Credentials 3', () => {
    cy.get('input[type="password"]').type("test");
    cy.contains('Submit').click();
    cy.contains('Missing Credentials');
  });

  it('Login Page - Invalid Email', () => {
    cy.get('input[name="email"]').type("test");
    cy.get('input[type="password"]').type("test");
    cy.contains('Submit').click();
    cy.contains('Invalid Email');
  });

  it('Login Page - Login as Admin', () => {
    cy.get('input[name="email"]').type("admin@admin.com");
    cy.get('input[type="password"]').type(adminPassword);
    cy.contains('Submit').click();
    cy.url().should('include', '/register')
    cy.contains('Logged in Successfully');
  });

  it('Login Page - Login as a Clinician', () => {
    cy.get('input[name="email"]').type("test.user.one@gmail.com");
    cy.get('input[type="password"]').type("useronepassword");
    cy.contains('Submit').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Logged in Successfully');
  });
  
  it('Login Page - Login as a Patient', () => {
    cy.get('input[name="email"]').type("test.user.two@gmail.com");
    cy.get('input[type="password"]').type("usertwopassword");
    cy.contains('Submit').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Logged in Successfully');
  });
})