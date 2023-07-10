import { defineStore } from 'pinia';
import { getSession } from './session';
import { router } from '@/router';
import { useAlertStore, useUsersStore, useRecordsStore, useOperationsStore } from '@/stores';

const session = getSession();

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: session.user,
        returnUrl: null,
        isAdmin: session.user ? session.user.admin ? true : false : false,
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
                    this.isAdmin = user.admin;
                    router.push(this.returnUrl || '/');
                }
            } catch (error) {
                const alertStore = useAlertStore();
                alertStore.error(error);                
            }
        },
        logout() {
            console.log(this.user);
            // const { username, token } = this.user;
            session.logout();
            this.user = null;
            this.isAdmin = false;

            // const alertStore = useAlertStore();
            const usersStore = useUsersStore();
            usersStore.reset()
            const recordsStore = useRecordsStore();
            recordsStore.reset();
            const operationsStore = useOperationsStore();
            operationsStore.reset();
            this.user = null;
            this.isAdmin = false;
            router.push('/account/login');
        }
    }
});
