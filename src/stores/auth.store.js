import { defineStore } from 'pinia';
import { getSession } from './session';
import { router } from '@/router';
import { useAlertStore, useUsersStore, useRecordsStore, useOperationsStore } from '@/stores';

const session = getSession();

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: session.user || JSON.parse(localStorage.getItem('user')),
        returnUrl: null,
        isAdmin: session.user.admin || ( JSON.parse(localStorage.getItem('isAdmin')) || false ),
        showProfileMenu: false,
    }),
    actions: {
        async login(username, password) {
            try {
                const login = await session.login(username, password);
                // console.log('login', login)
                if(login) { 
                    const user = {...session.user, token: session.token };
                    // console.log(user);
                    delete user.password;
                    this.user = user;
                    if(this.user.admin) {
                        this.isAdmin = true;
                        localStorage.setItem('isAdmin', JSON.stringify(true));
                    } else {
                        localStorage.setItem('isAdmin', JSON.stringify(false));
                    }
                    // store user details and jwt in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    router.push(this.returnUrl || '/');
                }
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error);                
            }
        },
        async logout() {
            // console.log(this.user);
            const { username, token } = this.user;
            try {
                await session.logout(username, token);
                this.user = null;
                this.isAdmin = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAdmin');
                

                // const alertStore = useAlertStore();
                const usersStore = useUsersStore();
                usersStore.reset()
                const recordsStore = useRecordsStore();
                recordsStore.reset();
                const operationsStore = useOperationsStore();
                operationsStore.reset();
                

                router.push('/account/login');

                // alertStore.success('Logged out');       
            } catch (error) {
                console.log(error)
                const alertStore = useAlertStore();
                alertStore.error(error);    
            }
        }
    }
});
