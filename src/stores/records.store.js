import { defineStore } from 'pinia';
import { getSession } from './session';

const baseUrl = `${import.meta.env.VITE_API_URL}/records`;

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
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 201 || code === 0) && data) {
                    this.users.push(data);
                    console.log(this.record, data)
                    // this.record = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.record = { error };
                throw new Error(error.message);
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
            this.records = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get('records', { page, size });
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
                    this.records = result;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
                this.records = { error };
            }
        },
        async getById(id) {
            console.log('XXXXX GET BY ID', id)
            this.record = { loading: true };
            try {
                const {
                    data,
                    code,
                    message
                } = await session.get(`records/${id}`);
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 200 || code === 0) && data) {
                    console.log(this.record, data)
                    this.record = data;
                } else {
                    throw new Error(message);
                }
            } catch (error) {
                console.warn(error);
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
                    console.log(this.record, data)
                    if(params.status === 'active') {
                        this.records.find(x => x.id === id).status = 'active';
                        this.records.find(x => x.id === id).isRestoring = false;
                    }
                    this.records = this.records.map(record =>{
                        if(record.id === id) {
                            return { ...record, ...data };
                        }
                        return record;
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
            // add isDeleting prop to record being deleted
            

            try {
                this.records.find(x => x.id === id).isDeleting = true;
                const {
                    data,
                    code,
                    message
                } = await session.delete(`records/${id}`);
                console.log({
                    data,
                    code,
                    message
                })
                if ((code === 200 || code === 0) && data) {
                    // remove record from list after deleted
                    this.records.find(x => x.id === id).status = 'inactive';
                    this.records.find(x => x.id === id).isDeleting = false;
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
