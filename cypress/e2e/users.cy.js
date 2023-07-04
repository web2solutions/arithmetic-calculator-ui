/*global cy describe, it, assert */

describe('Users CRUD', () => {

    it('Users Listing UI', () => {
        cy.intercept({
            method: 'POST',
            url: 'http://localhost:3000/dev/users/login', // that have a URL that matches '/users/*'
        }).as('loginUser');

        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/dev/users*', // that have a URL that matches '/users/*'
        }).as('listUsers');

        cy.intercept({
            method: 'POST',
            url: 'http://localhost:3000/dev/users*', // that have a URL that matches '/users/*'
        }).as('postUsers');

        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/dev/users/*', // that have a URL that matches '/users/*'
        }).as('getUser');

        cy.intercept({
            method: 'PUT',
            url: 'http://localhost:3000/dev/users/*', // that have a URL that matches '/users/*'
        }).as('putUser');

        cy.intercept({
            method: 'DELETE',
            url: 'http://localhost:3000/dev/users/*', // that have a URL that matches '/users/*'
        }).as('delUser');


        cy.visit('http://localhost:8080/account/login');

        const input_username = cy.get('input[name="username"]');
        input_username.type('admin@admin.com');
        const input_password = cy.get('input[name="password"]');
        input_password.type('123456');

        const button_login = cy.get('button[name="login"]');

        button_login.click();

        cy.wait('@loginUser').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, '1st List User API call has data');
            const { data } = interception.response.body;
            assert(!!data.username, 'valid user data');
        });

        cy.visit('http://localhost:8080/users');
        cy.wait(300);

        const title = cy.get('h1');
        title.contains('Users');
        cy.get('.table-striped');
        cy.get('a[href="/users/add"]');

        cy.wait('@listUsers').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, '1st List User API call has data');
            const { page, size, result, total } = interception.response.body.data;
            assert.isNumber(total, 'total records is a number');
            assert.isNumber(page, 'page number is a number');
            assert.isNumber(size, 'page size is a number');
            assert(Array.isArray(result), 'result is an array');
        });

        const addLink = cy.get('a[href="/users/add"]');
        addLink.click();

        cy.wait(500);

        const newAdminUserName = `admin_${Math.random()}@user.com`;

        const username = cy.get('input[name="username"]');
        username.type(newAdminUserName);

        const password = cy.get('input[name="password"]');
        password.type('123456');

        const input_status = cy.get('select[name="status"]');
        input_status.select('active');

        const input_admin = cy.get('select[name="admin"]');
        input_admin.select('true');

        const input_balance = cy.get('input[name="balance"]');
        input_balance.type(100);

        const button_save = cy.get('button[name="save"]');
        button_save.click();

        cy.wait('@postUsers').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, 'API call to create user has data');
            const { data, message } = interception.response.body;
            assert(message === 'created', 'created');
            assert(data.username, `created username is ${newAdminUserName}`);
            const alert_success = cy.get('.alert-success');
            alert_success.contains('User added');
        });

        let editingUser = '';

        cy.wait('@listUsers').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, '2st List User API call has data');
            const { page, size, result, total } = interception.response.body.data;
            assert.isNumber(total, 'total records is a number');
            assert.isNumber(page, 'page number is a number');
            assert.isNumber(size, 'page size is a number');
            assert(Array.isArray(result), 'result is an array');
            editingUser = result[1];
            const edit_button = cy.get(`a[href="/users/edit/${editingUser._id}"]`);
            edit_button.click();
        });


        cy.wait('@getUser').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, '1st Get User API call has data');
            (cy.get('input[name="balance"]')).clear();
            (cy.get('input[name="balance"]')).type('30')
            const { data } = interception.response.body;
            console.log('editingUser', editingUser)
            assert(data._id === editingUser._id, 'return same user id');

            (cy.get('button[name="save"]')).click();
        });

        cy.wait('@putUser').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, '1st Put User API call has data');
            const { data } = interception.response.body;
            console.log('editingUser', editingUser)
            assert(data._id === editingUser._id, 'return same user id');
            assert(data.balance === 30, 'return user');
        });

        

        cy.wait('@listUsers').then((interception) => {
            console.log('DDDDDDD', interception.response.body);
            assert.isNotNull(interception.response.body, '3st List User API call has data');
            const { page, size, result, total } = interception.response.body.data;
            assert.isNumber(total, 'total records is a number');
            assert.isNumber(page, 'page number is a number');
            assert.isNumber(size, 'page size is a number');
            assert(Array.isArray(result), 'result is an array');
            const editedUser = result[1];
            assert(editedUser.balance === 30, 'new user balance is 30');

            (cy.get(`button[name="delete_${editedUser._id}"]`)).click();

            cy.wait('@delUser').then((interception) => {
                console.log('DDDDDDD', interception.response.body);
                assert.isNotNull(interception.response.body, 'The call to the API to delete an user returned a response');
                const { data } = interception.response.body;
                assert(data === true, 'user is inactive');
    
                (cy.get(`button[name="restore_${editedUser._id}"]`)).click();
            });


            cy.wait('@putUser').then((interception) => {
                console.log('DDDDDDD', interception.response.body);
                assert.isNotNull(interception.response.body, 'The call to the API to restore an user returned a response');
                const { data } = interception.response.body;
                assert(data.status, 'user is active again');
            });
        });


        


        
        // User added
    });
});