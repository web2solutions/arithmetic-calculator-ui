<script setup>
import { storeToRefs } from 'pinia';
import { router } from '@/router';
import { useOperationsStore } from '@/stores';

const operationsStore = useOperationsStore();
const { operations } = storeToRefs(operationsStore);

function onChangePageSize (event) {
    const previousPage = router.currentRoute._value.query.page || false;
    const query = {
        size: +event.target.value
    };
    if(event.target.value === '') {
        delete query.size;
    }
    if (previousPage) query.page = previousPage;
    router.push({ path: '/operations', query: query })
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
    router.push({ path: '/operations', query })
}
</script>

<template>
    <h1>Operations</h1>
    <router-link to="/operations/add" class="btn btn-sm btn-success mb-2">Add Operation</router-link>
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
            <template v-if="operations.length">
                <tr v-for="operation in operations" :key="operation.id">
                    <td>{{ operation.id }}</td>
                    <td>{{ operation.cost }}</td>
                    <td>{{ operation.type }}</td>
                    <td>{{ operation.status }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/operations/edit/${operation.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button v-if="operation.status === 'active'" @click="operationsStore.delete(operation.id)" class="btn btn-sm btn-danger btn-delete-operation" :disabled="operation.isDeleting">
                            <span v-if="operation.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                        <button v-if="operation.status === 'inactive'" @click="operationsStore.update(operation.id, { status: 'active' })" class="btn btn-sm btn-success btn-delete-operation" :disabled="operation.isRestoring">
                            <span v-if="operation.isRestoring" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Restore</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="operations.loading">
                <td colspan="5" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="operations.error">
                <td colspan="5">
                    <div class="text-danger">Error loading operations: {{operations.error}}</div>
                </td>
            </tr>
            <tr>
                <td colspan="1">
                    <div class="text-danger align-left">Total: {{operationsStore.total}}</div>
                </td>
                <td colspan="2">
                    <div class="text-danger align-left">
                        <select name="pageSize" class="form-control" @change="onChangePageSize($event);">
                            <option value="">selecte one</option>
                            <option 
                                v-for="size in operationsStore.pageSizes" 
                                :key="size"
                                :value="size"
                                :selected="operationsStore.pageSize === size"
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
                                v-for="page in operationsStore.pageTotalRecords" 
                                :key="page"
                                :value="page"
                                :selected="operationsStore.page === page"
                                :class="{ 'selected': operationsStore.page === page }"
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
