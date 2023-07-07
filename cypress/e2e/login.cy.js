/*global cy describe, it, expect */

const localURL = 'http://localhost:3000/dev';
const awsURL = 'https://je6x0x8fa6.execute-api.us-east-2.amazonaws.com/test';

let APIURL = '';

const URL = 'http://localhost:8090/account/login';

describe('User login ' + process.env.NODE_ENV, () => {
  
  it('default ui ' + process.env.NODE_ENV, () => {
    
    cy.visit(URL);
    
    const currentServerPort = +window.location.port;
    if (currentServerPort === 8080) {
      // dev
      APIURL = localURL;
    }  else {
      // aws or CI
      APIURL = awsURL;
    }
    console.log(APIURL);
    cy.get('input[name="username"]');
    cy.get('input[name="password"]');
    cy.get('button[name="login"]');
    cy.get('a[href="/account/register"]');
  })
  
  it('must not be able to login new user with invalid username', () => {
    cy.visit(URL);
    
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
    cy.visit(URL);
    
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
    cy.visit(URL);
    
    const input_register = cy.get('a[href="/account/register"]');
    input_register.click();
    
    cy.on('url:changed', (newUrl) => {
      expect(newUrl).to.contain("register")
    })
  });
  
  it('must be able to login', () => {
    cy.visit(URL);
    
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