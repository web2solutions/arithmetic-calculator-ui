<script setup>
// import { Form, Field } from 'vee-validate';
// import * as Yup from 'yup';
import { ToolbarCrudRecord } from '@/components';
import { storeToRefs } from 'pinia';
import { router } from '@/router';
import { useRecordsStore, useOperationsStore } from '@/stores';

/* const schema = Yup.object().shape({
    operation_id: Yup.array()
        .required('Operation is required'),
        //.required('Number 2 is required'),
}); */

const recordsStore = useRecordsStore();
const operationsStore = useOperationsStore();
const { records } = storeToRefs(recordsStore);
// const { operations } = storeToRefs(operationsStore);
operationsStore.getAll();

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

/* function onSelectType() {
    
} */
</script>

<template>
    <ToolbarCrudRecord />
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 20%">User</th>
                <th style="width: 10%">User input</th>
                <th style="width: 20%">
                    Operation
                </th>
                <th style="width: 10%">Result</th>
                <th style="width: 10%">Amount</th>
                <th style="width: 50%">Date</th>
                <!-- <th style="width: 10%">Status</th>
                <th style="width: 10%"></th> -->
            </tr>
        </thead>
        <tbody>
            <template v-if="records.length">
                <tr v-for="record in records" :key="record.id">
                    <td>{{ record.user_id.username }}</td>
                    <td>{{ record.user_input_numbers.join(', ') }}</td>
                    <td>{{ record.operation_id?.type }}</td>
                    <td>{{ record.operation_response }}</td>
                    <td>{{ record.amount }}</td>
                    <td>{{ (new Date(record.date)).toDateString() }}</td>
                    <!-- <td>{{ record.status }}</td>
                    <td style="white-space: nowrap">
                        <button v-if="record.status === 'active'" @click="recordsStore.delete(record.id)" class="btn btn-sm btn-danger btn-delete-record" :disabled="record.isDeleting">
                            <span v-if="record.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                        <button v-if="record.status === 'inactive'" @click="recordsStore.update(record.id, { status: 'active' })" class="btn btn-sm btn-success btn-delete-record" :disabled="record.isRestoring">
                            <span v-if="record.isRestoring" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Restore</span>
                        </button> 
                    </td>-->
                </tr>
            </template>
            <tr v-if="records.loading">
                <td colspan="6" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="records.error">
                <td colspan="6">
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
                <td colspan="3">
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
