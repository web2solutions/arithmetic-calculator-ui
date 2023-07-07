import Swal from "sweetalert2";

const localURL = 'http://localhost:3000/dev';
// const localURL = 'https://je6x0x8fa6.execute-api.us-east-2.amazonaws.com/test';
const awsURL = 'https://je6x0x8fa6.execute-api.us-east-2.amazonaws.com/test';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    },
})

class Session {
    
    constructor() {
        const currentServerPort = +window.location.port;
        if (currentServerPort === 8080) {
            // dev
            this._apiURL = localURL;
        }  else {
            // aws or CI
            this._apiURL = awsURL;
        }

        console.log(process.env.NODE_ENV)
        console.log('SESSION', this._apiURL)
        this._user = false;
        this.setPublicHeaders();
        this.setPrivateHeaders();
    }

    setPublicHeaders () {
        this._headers_public = new Headers();
        this._headers_public.append('Content-Type', 'application/json');
        this._headers_private = new Headers();
        const userLstorage = localStorage.getItem('user');
        if (userLstorage) {
            const user = JSON.parse(userLstorage);
            this._user = user;
            this._headers_private.append('Authorization', `Bearer ${user.token}`)
        }
    }

    setPrivateHeaders (user) {
        this._headers_private = new Headers();
        this._headers_private.append('Content-Type', 'application/json');
        if (user) {
            this._user = user;
            this._headers_private.append('Authorization', `Bearer ${user.token}`);
            return;
        }
        const userLstorage = localStorage.getItem('user');
        if (userLstorage) {
            const user = JSON.parse(userLstorage);
            this._user = user;
            this._headers_private.append('Authorization', `Bearer ${user.token}`)
        }
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this._apiURL}/users/login`, {
                method: 'POST',
                headers: this._headers_public,
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
                this.setPrivateHeaders(data);
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully',
                    // text: 'Do you want to continue',
                    // confirmButtonText: 'Cool',
                })
                return true;
            } else {
                throw new Error(message);
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                // confirmButtonText: 'Cool',
            })
            throw error;
        }
    }
    async logout(username, token) {
        try {
            const response = await fetch(`${this._apiURL}/users/logout`, {
                method: 'POST',
                headers: this._headers_public,
                body: JSON.stringify({
                    username,
                    token
                }),
            });

            const {
                code,
                message
            } = await response.json();
            if ((code === 200 || code === 401 || code === 0)) {
                this._user = false;
                this._headers_private = new Headers();
                Toast.fire({
                    icon: 'success',
                    title: 'Signed out successfully',
                    // text: 'Do you want to continue',
                    // confirmButtonText: 'Cool',
                })
                return true;
            } else {
                throw new Error(message);
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                // confirmButtonText: 'Cool',
            });
            throw error;
        }
    }

    get user() {
        return this._user;
    }

    get isAdmin() {
        return this._user ? this._user.admin : false;
    }

    get token() {
        return this._user ? this._user.token : '';
    }

    async 'get'(endPoint, paging = {}, filter = false) {
        const { page, size } = paging;
        try {
            let url = `${this._apiURL}/${endPoint}`;
            if (page) {
                url += `?page=${page}`
            }
            if (size) {
                url += `&size=${size}`
            }
            if (filter) {
                url += `&filter=${filter}`
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: this._headers_private,
            });

            const {
                data,
                code,
                message
            } = await response.json();

            if(response.status >= 400 && response.status <= 500) {
                throw new Error(message);
            }

            return {
                data,
                code,
                message
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                // confirmButtonText: 'Cool',
            });
            throw error;
        }
    }

    async 'post'(endPoint = '', payload = {}) {
        try {
            const url = `${this._apiURL}/${endPoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: this._headers_private,
                body: JSON.stringify(payload),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            if(response.status >= 400 && response.status <= 500) {
                throw new Error(message);
            }

            return {
                data,
                code,
                message
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                // confirmButtonText: 'Cool',
            });
            throw error;
        }
    }

    async 'put'(endPoint = '', payload = {}) {
        try {
            const url = `${this._apiURL}/${endPoint}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: this._headers_private,
                body: JSON.stringify(payload),
            });

            const {
                data,
                code,
                message
            } = await response.json();
            if(response.status >= 400 && response.status <= 500) {
                throw new Error(message);
            }

            return {
                data,
                code,
                message
            }
        } catch (error) {
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                // confirmButtonText: 'Cool',
            });
            throw error;
        }
    }

    async 'delete'(endPoint = '') {
        try {
            const url = `${this._apiURL}/${endPoint}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this._headers_private,
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
            Toast.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                // confirmButtonText: 'Cool',
            });
            throw error;
        }
    }
}

let session = false;
export const getSession = function () {
    if (!session) {
        session = new Session();
    }
    return session;
}