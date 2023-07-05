import { defineStore } from 'pinia';
import { getSession } from './session';
import { useAuthStore } from '@/stores';
import { useAlertStore } from '@/stores';
const session = getSession();

export const useUsersStore = defineStore({
    id: 'users',
    state: () => ({
        users: {},
        user: {},
        page: 1,
        pageSize: 20,
        pageSizes: [5, 10, 15, 20, 50, 100],
        total: 0,
        numberOfPages: 0,
        pageTotalRecords: [1],
        pages: []
    }),
    actions: {
        reset () {
            this.operations = {};
            this.operation = {};
            this.page = 1;
            this.pageSize = 20;
            this.pageSizes = [5, 10, 15, 20, 50, 100];
            this.total = 0;
            this.numberOfPages = 0;
            this.pageTotalRecords = [1];
            this.pages = [];
        },
        setPaging (query) {
            const { page, size } = query;
            if (page) {
                this.page = page;
            }
            if (size) {
                this.pageSize = size;
            }
        },
        async register(user) {
            try {
                const {
                    data,
                    code,
                    message
                } = await session.post(`users/register`, user);
                if ((code === 201 || code === 0) && data) {
                    // 
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                // error.message
				// Not Found, Unauthorized
				const alertStore = useAlertStore();
                alertStore.error(error.message); 
                this.user = { error };
				throw error;
            }
        },
        async create(user) {
            try {
                const {
                    data,
                    code,
                    message
                } = await session.post(`users`, user);
                if ((code === 201 || code === 0) && data) {
                    if (isNaN(this.users.length)) {
                        this.users = [];
                    }
                    delete data.password;
                    this.users.push(data);
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.user = { error };
                if(error.message === 'Unauthorized') {
                    const authStore = useAuthStore();
                    authStore.logout();
                }
                throw new Error(error.message);
            }
        },
        async getAll() {
            const page = this.page;
            const size = this.pageSize
            this.users = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get('users', { page, size });
                if ((code === 200 || code === 0) && data) {
                    const { result, page, size, total } = data;
                    this.page = +page;
                    this.total = +total;
                    this.pageSize = +size;
                    this.numberOfPages = Math.ceil(this.total / this.pageSize);
                    this.pageTotalRecords = [];
                    for(let x = 1; x <= this.numberOfPages; x++) {
                        this.pageTotalRecords.push(x);
                    }
                    this.users = result;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error.message);
                this.users = { error };
								if(error.message === 'Unauthorized') {
									const authStore = useAuthStore();
									authStore.logout();
								}
            }
        },
        async getById(id) {
            this.user = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get(`users/${id}`);
                if ((code === 200 || code === 0) && data) {
                    delete data.password;
                    this.user = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.user = { error };
								if(error.message === 'Unauthorized') {
									const authStore = useAuthStore();
									authStore.logout();
								}
            }
        },

        async update(id, params) {
            if(params.status === 'active') {
                this.users.find(x => x.id === id).isRestoring = true;
            }
            try {
                const {
                    data,
                    code,
                    message
                } = await session.put(`users/${id}`, params);
                if ((code === 200 || code === 0) && data) {
                    delete data.password;
                    if(params.status === 'active') {
                        this.users.find(x => x.id === id).status = 'active';
                        this.users.find(x => x.id === id).isRestoring = false;
                    }
                    this.users = this.users.map(user =>{
                        if(user.id === id) {
                            return { ...user, ...data, token: session.token };
                        }
                        return user;
                    });
                    // update stored user if the logged in user updated their own record
                    const authStore = useAuthStore();
                    if (id === authStore.user.id) {
                        // update local storage
                        const user = { ...authStore.user, ...params, token: session.token };
                        localStorage.setItem('user', JSON.stringify(user));

                        // update auth user in pinia state
                        authStore.user = user;
                    }
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
								if(error.message === 'Unauthorized') {
									const authStore = useAuthStore();
									authStore.logout();
								}
                throw error;
            }
        },
        async delete(id) {
            // add isDeleting prop to user being deleted
            try {
                this.users.find(x => x.id === id).isDeleting = true;
                const {
                    data,
                    code,
                    message
                } = await session.delete(`users/${id}`);
                if ((code === 200 || code === 0) && data) {
                    // remove user from list after deleted
                    this.users.find(x => x.id === id).status = 'inactive';
                    this.users.find(x => x.id === id).isDeleting = false;

                    // auto logout if the logged in user deleted their own record
                    const authStore = useAuthStore();
                    if (id === authStore.user.id) {
                        authStore.logout();
                    }
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
								if(error.message === 'Unauthorized') {
									const authStore = useAuthStore();
									authStore.logout();
								}
                throw error;
            }
        }
    }
});
