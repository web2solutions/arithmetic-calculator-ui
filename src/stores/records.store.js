import { defineStore } from 'pinia';
import { getSession } from './session';
import { useAuthStore } from '@/stores';

const session = getSession();

export const useRecordsStore = defineStore({
    id: 'records',
    state: () => ({
        records: {},
        record: {},
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
                recordsStore.page = page;
            }
            if (size) {
                recordsStore.pageSize = size;
            }
        },
        async create(record) {
            try {
                const {
                    data,
                    code,
                    message
                } = await session.post(`records`, record);
                if ((code === 201 || code === 0) && data) {
                    if (isNaN(this.records.length)) {
                        this.records = [];
                    }
                    this.records.push(data);
                } else {
                    throw new Error(message);
                }
                return {
                    data,
                    code,
                    message
                }
            } catch (error) {
                console.warn(error);
                this.record = { error };
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
            this.records = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get('records', { page, size });
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
                    this.records = result;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                if(error.message === 'Unauthorized') {
                    const authStore = useAuthStore();
                    authStore.logout();
                }
                this.records = { error };
            }
        },
        async getById(id) {
            this.record = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get(`records/${id}`);
                if ((code === 200 || code === 0) && data) {
                    this.record = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                if(error.message === 'Unauthorized') {
                    const authStore = useAuthStore();
                    authStore.logout();
                }
                this.record = { error };
            }
        },

        async update(id, params) {
            if(params.status === 'active') {
                this.records.find(x => x.id === id).isRestoring = true;
            }
            try {
                const {
                    data,
                    code,
                    message
                } = await session.put(`records/${id}`, params);
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 200 || code === 0) && data) {
                    if(params.status === 'active') {
                        this.records.find(x => x.id === id).status = 'active';
                        this.records.find(x => x.id === id).isRestoring = false;
                    }
                    /* this.records = this.records.map(record =>{
                        if(record.id === id) {
                            return { ...record, ...data };
                        }
                        return record;
                    });*/
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
                this.records.find(x => x.id === id).isDeleting = true;
                const {
                    data,
                    code,
                    message
                } = await session.delete(`records/${id}`);
                if ((code === 200 || code === 0) && data) {
                    // remove record from list after deleted
                    this.records.find(x => x.id === id).status = 'inactive';
                    this.records.find(x => x.id === id).isDeleting = false;
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

        
    }
});
