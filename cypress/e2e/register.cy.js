/*global cy describe, it, expect */

const localURL = 'http://localhost:3000/dev';
const awsURL = 'https://je6x0x8fa6.execute-api.us-east-2.amazonaws.com/test';

const env = process.env.NODE_ENV || 'dev';
let APIURL = '';

if (env === 'dev' || env === '') {
  APIURL  = localURL;
} else {
  APIURL  = awsURL
}

const URL = 'http://localhost:8080/account/register';

describe('Register user', () => {
  const newUsername = `newuser${Math.random()}@user.com`;
  it('default ui', () => {
    cy.visit(URL);
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('a[href="/account/login"]');
  })

  it('must not be able to register new user with invalid username', () => {
    cy.visit(URL);

    const input_username = cy.get('input[name="username"]');
    input_username.type(`newuser${Math.random()}`);
    const input_password = cy.get('input[name="password"]');
    input_password.type('123456');

    const button_register = cy.get('button[name="register"]');
    button_register.click();

    // cy.wait(500);

    const form_feedback = cy.get('.invalid-feedback');
    form_feedback.contains('username must be a valid email');
  });

  it('must not be able to register new user with invalid password', () => {
    cy.visit(URL);

    const input_username = cy.get('input[name="username"]');
    input_username.type(`newuser${Math.random()}@user.com`);
    const input_password = cy.get('input[name="password"]');
    input_password.type('123');

    const button_register = cy.get('button[name="register"]');
    button_register.click();

    // cy.wait(500);

    const form_feedback = cy.get('.invalid-feedback');
    form_feedback.contains('Password must be at least 6 characters');
  });

  it('cancel button should go to login page', () => {
    cy.visit(URL);

    const input_cancel = cy.get('a[href="/account/login"]');
    input_cancel.click();

    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain("login")
    })
  });

  it('must be able to register new user', () => {
    cy.visit(URL);

    cy.intercept({
        method: 'POST',
        url: `${APIURL}/users/register`, // that have a URL that matches '/users/*'
    }).as('registerUser');

    const input_username = cy.get('input[name="username"]');
    input_username.type(newUsername);
    const input_password = cy.get('input[name="password"]');
    input_password.type('123456');

    const button_register = cy.get('button[name="register"]');

    button_register.click();

    cy.wait('@registerUser');

    const alert_success = cy.get('.alert-success');
    alert_success.contains('Registration successful');
  });

  it('must not be able to register new user with existing username', () => {
    cy.visit(URL);
    
    cy.intercept({
        method: 'POST',
        url: `${APIURL}/users/register`, // that have a URL that matches '/users/*'
    }).as('registerUser');

    const input_username = cy.get('input[name="username"]');
    input_username.type(newUsername);
    const input_password = cy.get('input[name="password"]');
    input_password.type('123456');

    const button_register = cy.get('button[name="register"]');

    button_register.click();

    cy.wait('@registerUser');

    const alert_danger = cy.get('.alert-danger');
    alert_danger.contains('Error');
  });
});