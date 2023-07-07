import { defineStore } from 'pinia';
import { getSession } from './session';
import { useAuthStore } from '@/stores';

const session = getSession();

export const useOperationsStore = defineStore({
    id: 'operations',
    state: () => ({
        operations: {},
        operation: {},
        filter: false,
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
            this.filter = false;
            this.page = 1;
            this.pageSize = 20;
            this.pageSizes = [5, 10, 15, 20, 50, 100];
            this.total = 0;
            this.numberOfPages = 0;
            this.pageTotalRecords = [1];
            this.pages = [];
        },
        setPaging(query) {
            const { page, size } = query;
            if (page) {
                this.page = page;
            }
            if (size) {
                this.pageSize = size;
            }
        },
        async create(operation) {
            try {
                const {
                    data,
                    code,
                    message
                } = await session.post(`operations`, operation);
                if ((code === 201 || code === 0) && data) {
                    if (isNaN(this.operations.length)) {
                        this.operations = [];
                    }
                    this.operations.push(data);
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.operation = { error };
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
            this.operations = { loading: true };
            const filter = this.filter;
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get('operations', { page, size }, filter);
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
                    this.operations = result;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                if(error.message === 'Unauthorized') {
                    const authStore = useAuthStore();
                    authStore.logout();
                }
                this.operations = { error };
            }
        },
        async getById(id) {
            this.operation = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get(`operations/${id}`);
                if ((code === 200 || code === 0) && data) {
                    this.operation = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                if(error.message === 'Unauthorized') {
                    const authStore = useAuthStore();
                    authStore.logout();
                }
                this.operation = { error };
            }
        },

        async update(id, params) {
            if(params.status === 'active') {
                this.operations.find(x => x.id === id).isRestoring = true;
            }
            try {
                const {
                    data,
                    code,
                    message
                } = await session.put(`operations/${id}`, params);
                if ((code === 200 || code === 0) && data) {
                    if(params.status === 'active') {
                        this.operations.find(x => x.id === id).status = 'active';
                        this.operations.find(x => x.id === id).isRestoring = false;
                    }
                    this.operations = this.operations.map(operation =>{
                        if(operation.id === id) {
                            return { ...operation, ...data };
                        }
                        return operation;
                    });
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
            try {
                this.operations.find(x => x.id === id).isDeleting = true;
                const {
                    data,
                    code,
                    message
                } = await session.delete(`operations/${id}`);
                if ((code === 200 || code === 0) && data) {
                    // remove operation from list after deleted
                    this.operations.find(x => x.id === id).status = 'inactive';
                    this.operations.find(x => x.id === id).isDeleting = false;
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
