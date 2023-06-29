import { defineStore } from 'pinia';

import { getSession } from './session';

import { fetchWrapper } from '@/helpers';
import { router } from '@/router';
import { useAlertStore } from '@/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;
const session = getSession();

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: session.user || JSON.parse(localStorage.getItem('user')),
        returnUrl: null,
        isAdmin: session.user.admin || JSON.parse(localStorage.getItem('isAdmin')),
    }),
    actions: {
        async login(username, password) {
            try {

                const login = await session.login(username, password);
                console.log('login', login)
                if(login) {
                    // const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });    
                    const user = {...session.user};
                    // console.log(user)
                    this.user = user;

                    if(this.user.admin) {
                        this.isAdmin = true;
                    }

                    // store user details and jwt in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));

                    // redirect to previous url or default to home page
                    router.push(this.returnUrl || '/');
                    // return;
                }

                
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error);                
            }
        },
        async logout() {
            const { username, token } = this.user;
            try {
                const logout = await session.logout(username, token);
                this.user = null;
                localStorage.removeItem('user');
                router.push('/account/login');
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error);    
            }
        }
    }
});
