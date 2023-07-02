class Session {
    #_apiURL = 'http://localhost:3000/dev';
    #_user = false;
    #_headers_public = new Headers();
    #_headers_private = new Headers();
    constructor(apiURL) {
        // this.#_apiURL = apiURL;
        const userLstorage = localStorage.getItem('user');
        if (userLstorage) {
            const user = JSON.parse(userLstorage);
            this.#_user = user;
            this.#_headers_private = new Headers();
            this.#_headers_private.append('Authorization', `Bearer ${user.token}`)
        }
        // this.#_headers_public.append('Content-Type', 'application/json');
        // this.#_headers_private.append('Content-Type', 'application/json');
        // this.#_headers_private.append('Authorization', `Bearer ${this.token}`)

    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.#_apiURL}/users/login`, {
                method: 'POST',
                headers: this.#_headers_public,
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
            if ((code === 200 || code === 0) && data) {
                this.#_user = data;
                this.#_headers_private = new Headers();
                this.#_headers_private.append('Authorization', `Bearer ${this.#_user.token}`)
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
        console.log('LOGOUT >>>>>>>>', { username, token });
        try {
            const response = await fetch(`${this.#_apiURL}/users/logout`, {
                method: 'POST',
                headers: this.#_headers_public,
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
            if ((code === 200 || code === 401 || code === 0)) {
                this.#_user = false;
                this.#_headers_public = new Headers();
                this.#_headers_private = new Headers();
                return true;
            } else {
                throw new Error(message);
            }
        } catch (error) {
            console.log('error XXXXXXXXX', error.message);
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

    async 'get'(endPoint, paging = {}) {
        const { page, size } = paging;
        try {
            let url = `${this.#_apiURL}/${endPoint}`;
            if (page) {
                url += `?page=${page}`
            }
            if (size) {
                url += `&size=${size}`
            }
            console.log(url, this.#_headers_private)
            const response = await fetch(url, {
                method: 'GET',
                headers: this.#_headers_private,
            });

            const {
                data,
                code,
                message
            } = await response.json();

            if(response.status >= 400 && response.status <= 500) {
                throw new Error(response.statusText);
            }

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
                headers: this.#_headers_private,
                body: JSON.stringify(payload),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            console.log( {
                data,
                code,
                message,
                response
            })
            if(response.status >= 400 && response.status <= 500) {
                throw new Error(response.statusText);
            }

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
                headers: this.#_headers_private,
                body: JSON.stringify(payload),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            if(response.status >= 400 && response.status <= 500) {
                throw new Error(response.statusText);
            }

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
                headers: this.#_headers_private,
            });

            const {
                data,
                code,
                message
            } = await response.json();
            if(response.status >= 400 && response.status <= 500) {
                throw new Error(response.statusText);
            }

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