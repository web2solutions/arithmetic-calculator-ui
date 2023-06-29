class Session {
    #_apiURL = 'http://localhost:3000/dev';
    #_user = false;
    #_headers = {};
    constructor(apiURL) {
        // this.#_apiURL = apiURL;
        const userLstorage = localStorage.getItem('user');
        if (userLstorage) {
            const user = JSON.parse(userLstorage);
            this.#_user = user;
        }
        this.#_headers = new Headers();

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.#_apiURL}/users/login`, {
                method: 'POST',
                headers: this.#_headers,
                body: JSON.stringify({
                    username,
                    password
                }),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log({
                data,
                code,
                message
            });

            if ((code === 200 || code === 0) && data) {
                this.#_user = data;
                return true;
            } else {
                throw new Error(message);
            }
        } catch (error) {
            console.log('error', error.message);
            throw error;
        }
    }
    async logout(username, token) {
        try {
            const response = await fetch(`${this.#_apiURL}/users/logout`, {
                method: 'POST',
                headers: this.#_headers,
                body: JSON.stringify({
                    username,
                    token
                }),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log({
                data,
                code,
                message
            });

            if ((code === 200 || code === 0) && data) {
                this.#_user = false;
                return true;
            } else {
                throw new Error(message);
            }
        } catch (error) {
            console.log('error', error.message);
            throw error;
        }
    }

    get user() {
        return this.#_user;
    }

    get isAdmin() {
        return this.#_user ? this.#_user.admin : false;
    }

    get token() {
        return this.#_user ? this.#_user.token : '';
    }

    async 'get'(endPoint, paging) {
        const { page, size } = paging;
        console.log({ page, size })
        try {
            const url = `${this.#_apiURL}/${endPoint}?page=${page}&size=${size}`;
            console.log(url)
            const response = await fetch(url, {
                method: 'GET',
                headers: this.#_headers,
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log({
                data,
                code,
                message
            });

            return {
                data,
                code,
                message
            }
        } catch (error) {
            console.log('error', error.message);
            throw error;
        }
    }

    async 'post'(endPoint = '', payload = {}) {
        try {
            const url = `${this.#_apiURL}/${endPoint}`;
            console.log(url)
            const response = await fetch(url, {
                method: 'POST',
                headers: this.#_headers,
                body: JSON.stringify(payload),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log({
                data,
                code,
                message
            });

            return {
                data,
                code,
                message
            }
        } catch (error) {
            console.log('error', error.message);
            throw error;
        }
    }

    async 'put'(endPoint = '', payload = {}) {
        try {
            const url = `${this.#_apiURL}/${endPoint}`;
            console.log(url)
            const response = await fetch(url, {
                method: 'PUT',
                headers: this.#_headers,
                body: JSON.stringify(payload),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log({
                data,
                code,
                message
            });

            return {
                data,
                code,
                message
            }
        } catch (error) {
            console.log('error', error.message);
            throw error;
        }
    }

    async 'delete'(endPoint = '') {
        try {
            const url = `${this.#_apiURL}/${endPoint}`;
            console.log(url)
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.#_headers,
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log({
                data,
                code,
                message
            });

            return {
                data,
                code,
                message
            }
        } catch (error) {
            console.log('error', error.message);
            throw error;
        }
    }
}

let session = false;
export const getSession = function () {
    if (!session) {
        console.info('creating session');
        session = new Session();
    }
    return session;
}