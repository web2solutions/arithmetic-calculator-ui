import { defineStore } from 'pinia';
import { getSession } from './session';

const session = getSession();

export const useOperationsStore = defineStore({
    id: 'operations',
    state: () => ({
        operations: {},
        operation: {},
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
                operationsStore.page = page;
            }
            if (size) {
                operationsStore.pageSize = size;
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
                    this.users.push(data);
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.operation = { error };
                throw new Error(error.message);
            }
        },
        async getAll() {
            const page = this.page;
            const size = this.pageSize
            this.operations = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get('operations', { page, size });
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
                throw error;
            }
        }
    }
});
