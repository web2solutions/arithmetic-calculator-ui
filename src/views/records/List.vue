<script setup>
import { storeToRefs } from 'pinia';
import { router } from '@/router';
import { useRecordsStore } from '@/stores';

const recordsStore = useRecordsStore();
const { records } = storeToRefs(recordsStore);

function onChangePageSize (event) {
    const previousPage = router.currentRoute._value.query.page || false;
    const query = {
        size: +event.target.value
    };
    if(event.target.value === '') {
        delete query.size;
    }
    if (previousPage) query.page = previousPage;
    router.push({ path: '/records', query: query })
}

function onChangePageNumber (event) {
    
    const previousSize = router.currentRoute._value.query.size || false;
    const query = {
        page: +event.target.value,
    };
    if(event.target.value === '') {
        delete query.page;
    }
    if (previousSize) query.size = previousSize;
    router.push({ path: '/records', query })
}
</script>

<template>
    <h1>Records</h1>
    <router-link to="/records/add" class="btn btn-sm btn-success mb-2">Add Record</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">ID</th>
                <th style="width: 20%">Cost</th>
                <th style="width: 30%">Type</th>
                <th style="width: 10%">Status</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="records.length">
                <tr v-for="record in records" :key="record.id">
                    <td>{{ record.id }}</td>
                    <td>{{ record.cost }}</td>
                    <td>{{ record.type }}</td>
                    <td>{{ record.status }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/records/edit/${record.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button v-if="record.status === 'active'" @click="recordsStore.delete(record.id)" class="btn btn-sm btn-danger btn-delete-record" :disabled="record.isDeleting">
                            <span v-if="record.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                        <button v-if="record.status === 'inactive'" @click="recordsStore.update(record.id, { status: 'active' })" class="btn btn-sm btn-success btn-delete-record" :disabled="record.isRestoring">
                            <span v-if="record.isRestoring" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Restore</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="records.loading">
                <td colspan="5" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="records.error">
                <td colspan="5">
                    <div class="text-danger">Error loading records: {{records.error}}</div>
                </td>
            </tr>
            <tr>
                <td colspan="1">
                    <div class="text-danger align-left">Total: {{recordsStore.total}}</div>
                </td>
                <td colspan="2">
                    <div class="text-danger align-left">
                        <select name="pageSize" class="form-control" @change="onChangePageSize($event);">
                            <option value="">selecte one</option>
                            <option 
                                v-for="size in recordsStore.pageSizes" 
                                :key="size"
                                :value="size"
                                :selected="recordsStore.pageSize === size"
                            >
                                show {{size}} records per page
                            </option>
                        </select>
                    </div>
                </td>
                <td colspan="2">
                    <div class="text-danger align-left">
                        <select name="pageSize" class="form-control" @change="onChangePageNumber($event);">
                            <option value="">selecte one</option>
                            <option 
                                v-for="page in recordsStore.pageTotalRecords" 
                                :key="page"
                                :value="page"
                                :selected="recordsStore.page === page"
                                :class="{ 'selected': recordsStore.page === page }"
                            >
                                show page {{page}}
                            </option>
                        </select>
                    </div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
<style scoped>
@import '@/assets/list.css';
</style>
