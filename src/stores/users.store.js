import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';
import { getSession } from './session';
import { fetchWrapper } from '@/helpers';
import { useAuthStore } from '@/stores';


// const route = useRoute();
// const id = route.params.id;
// const query = route.query || {};
// let { page = 1, size = 20 } = query;

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

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
        setPaging (query) {
            const { page, size } = query;
            if (page) {
                usersStore.page = page;
            }
            if (size) {
                usersStore.pageSize = size;
            }
        },
        async register(user) {
            try {
                const {
                    data,
                    code,
                    message
                } = await session.post(`users`, user);
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 201 || code === 0) && data) {
                    console.log(this.user, data)
                    // this.user = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.user = { error };
            }
        },
        async getAll() {
            // const route = useRoute();
            // const query = route.query || {};
            // console.log('????? query', query)
            const page = this.page;
            const size = this.pageSize
            // const route = useRoute();
            // const id = route.params.id;
            // const query = route.query || {};
            // console.info('xxxxx>>>>>>', query)
            // let { page = 1, size = 20 } = query;
            this.users = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get('users', { page, size });
                console.log({
                    data,
                    code,
                    message
                })
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
                console.warn(error);
                this.users = { error };
            }
        },
        async getById(id) {
            console.log('XXXXX GET BY ID', id)
            this.user = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get(`users/${id}`);
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 200 || code === 0) && data) {
                    console.log(this.user, data)
                    this.user = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.user = { error };
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
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 200 || code === 0) && data) {
                    console.log(this.user, data)
                    if(params.status === 'active') {
                        this.users.find(x => x.id === id).status = 'active';
                        this.users.find(x => x.id === id).isRestoring = false;
                    }
                    this.users = this.users.map(user =>{
                        if(user.id === id) {
                            return { ...user, ...data };
                        }
                        return user;
                    });
                    // update stored user if the logged in user updated their own record
                    const authStore = useAuthStore();
                    if (id === authStore.user.id) {
                        // update local storage
                        const user = { ...authStore.user, ...params };
                        localStorage.setItem('user', JSON.stringify(user));

                        // update auth user in pinia state
                        authStore.user = user;
                    }
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
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
                console.log({
                    data,
                    code,
                    message
                })
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
                throw error;
            }
        }
    }
});
