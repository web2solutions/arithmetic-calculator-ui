import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore, useAlertStore } from '@/stores';
import { Home } from '@/views';
import accountRoutes from './account.routes';
import usersRoutes from './users.routes';
import operationsRoutes from './operations.routes';
import recordsRoutes from './records.routes';
import create_operationRoutes from './create_operation.routes';

import { useUsersStore, useOperationsStore, useRecordsStore } from '@/stores';


export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: Home },
        { ...accountRoutes },
        { ...usersRoutes },
        { ...create_operationRoutes },
        { ...operationsRoutes },
        { ...recordsRoutes },
        // catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});

router.beforeEach(async (to, from) => {
    console.info('>>>>>>>>>>>> TO', to)
    console.info('>>>>>>>>>>>> FROM', from)
    // clear alert on route change
    const alertStore = useAlertStore();
    alertStore.clear();

    const usersStore = useUsersStore();
    const operationStore = useOperationsStore();
    const recordStore = useRecordsStore();

    // redirect to login page if not logged in and trying to access a restricted page 
    const publicPages = ['/account/login', '/account/register'];
    const authRequired = !publicPages.includes(to.path);
    const authStore = useAuthStore();
    console.log('router.beforeEach authStore', authStore)

    if (authRequired && !authStore.user) {
        authStore.returnUrl = to.fullPath;
        return '/account/login';
    }

    
    if(to.path === '/users' ) {
        let oldPage = undefined;
        let oldSize = undefined;
        if(from.path === '/users') {
            const oldQUery = from.query;
            oldPage = oldQUery.page;
            oldSize = oldQUery.size;
        }
        console.warn('==== setting paging vars')
        const { page, size } = to.query;
        if (!isNaN(page)) {
            usersStore.page = page;
        } else {
            if(!isNaN(oldPage)) {
                usersStore.page = oldPage
            }
        }
        if (!isNaN(size)) {
            usersStore.pageSize = size;
        } else {
            if(!isNaN(oldSize)) {
                usersStore.pageSize = oldSize;
            }
        }
        usersStore.getAll();
    }


    if(to.path === '/operations') {
        let oldPage = undefined;
        let oldSize = undefined;
        if(from.path === '/operations') {
            const oldQUery = from.query;
            oldPage = oldQUery.page;
            oldSize = oldQUery.size;
        }
        console.warn('==== setting paging vars')
        const { page, size } = to.query;
        if (!isNaN(page)) {
            operationStore.page = page;
        } else {
            if(!isNaN(oldPage)) {
                operationStore.page = oldPage
            }
        }
        if (!isNaN(size)) {
            operationStore.pageSize = size;
        } else {
            if(!isNaN(oldSize)) {
                operationStore.pageSize = oldSize;
            }
        }
        operationStore.getAll();
    }

    if(to.path === '/records') {
        let oldPage = undefined;
        let oldSize = undefined;
        if(from.path === '/records') {
            const oldQUery = from.query;
            oldPage = oldQUery.page;
            oldSize = oldQUery.size;
        }
        console.warn('==== setting paging vars')
        const { page, size } = to.query;
        if (!isNaN(page)) {
            recordStore.page = page;
        } else {
            if(!isNaN(oldPage)) {
                recordStore.page = oldPage
            }
        }
        if (!isNaN(size)) {
            recordStore.pageSize = size;
        } else {
            if(!isNaN(oldSize)) {
                recordStore.pageSize = oldSize;
            }
        }
        recordStore.getAll();
    }
    
});
