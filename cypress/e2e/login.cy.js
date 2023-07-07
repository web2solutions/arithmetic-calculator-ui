/*global cy describe, it, expect, Cypress */
// import { Cypress } from 'cypress';

const env = Cypress.env('NODE_ENV');
const localURL = 'http://localhost:3000/dev';
const awsURL = 'https://je6x0x8fa6.execute-api.us-east-2.amazonaws.com/test';
const port = env === 'dev' ? 8080 : env === 'ci' ? 8090 : 8080;
const URL = `http://localhost:${port}/`;
let APIURL = '';
if (port === 8080) {
  // dev
  APIURL = localURL;
}  else {
  // aws or CI
  APIURL = awsURL;
}
//console.log(URL, APIURL);

describe('User login ' + env, () => {
  
  it('default ui ' + env, () => {
    console.log(URL)
    cy.visit(URL + 'account/login');
    
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('button[name="login"]');
    cy.get('a[href="/account/register"]');
  })
  
  it('must not be able to login new user with invalid username', () => {
    cy.visit(URL + 'account/login');
    
    const input_username = cy.get('input[name="username"]');
    input_username.type(`newuser${Math.random()}`);
    const input_password = cy.get('input[name="password"]');
    input_password.type('123456');
    
    const button_login = cy.get('button[name="login"]');
    button_login.click();
    
    // cy.wait(500);
    
    const form_feedback = cy.get('.invalid-feedback');
    form_feedback.contains('username must be a valid email');
  });
  
  it('must not be able to login new user with invalid password', () => {
    cy.visit(URL + 'account/login');
    
    const input_username = cy.get('input[name="username"]');
    input_username.type(`newuser${Math.random()}@user.com`);
    const input_password = cy.get('input[name="password"]');
    input_password.type('123');
    
    const button_login = cy.get('button[name="login"]');
    button_login.click();
    
    // cy.wait(500);
    
    const form_feedback = cy.get('.invalid-feedback');
    form_feedback.contains('Password must be at least 6 characters');
  });
  
  it('register button should go to register page', () => {
    cy.visit(URL + 'account/login');
    
    const input_register = cy.get('a[href="/account/register"]');
    input_register.click();
    
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain("register")
    })
  });
  
  it('must be able to login', () => {
    cy.visit(URL + 'account/login');
    
    cy.intercept({
      method: 'POST',
      url: `${APIURL}/users/login`, // that have a URL that matches '/users/*'
    }).as('loginUser');
    
    const input_username = cy.get('input[name="username"]');
    input_username.type('admin@admin.com');
    const input_password = cy.get('input[name="password"]');
    input_password.type('123456');
    
    const button_login = cy.get('button[name="login"]');
    
    button_login.click();
    
    cy.wait('@loginUser');
    
    const alert_success = cy.get('h1');
    alert_success.contains('Hi admin@admin.com!');
  });
  
});