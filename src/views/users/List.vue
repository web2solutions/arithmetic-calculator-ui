<script setup>
import { storeToRefs } from 'pinia';
import { router } from '@/router';
import { useUsersStore } from '@/stores';

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

function onChangePageSize (event) {
    const previousPage = router.currentRoute._value.query.page || false;
    const query = {
        size: +event.target.value
    };
    if(event.target.value === '') {
        delete query.size;
    }
    if (previousPage) query.page = previousPage;
    router.push({ path: '/users', query: query })
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
    router.push({ path: '/users', query })
}
</script>

<template>
    <h1>Users</h1>
    <router-link to="/users/add" class="btn btn-sm btn-success mb-2">Add User</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">ID</th>
                <th style="width: 40%">Username</th>
                <th style="width: 10%">Type</th>
                <th style="width: 10%">Balance</th>
                <th style="width: 10%">Status</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="users.length">
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.admin ? 'admin' : 'user' }}</td>
                    <td>{{ user.balance }}</td>
                    <td>{{ user.status }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/edit/${user.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button :name="'delete_' + user.id" v-if="user.status === 'active'" @click="usersStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                        <button :name="'restore_' + user.id" v-if="user.status === 'inactive'" @click="usersStore.update(user.id, { status: 'active' })" class="btn btn-sm btn-success btn-delete-user" :disabled="user.isRestoring">
                            <span v-if="user.isRestoring" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Restore</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="users.loading">
                <td colspan="6" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="users.error">
                <td colspan="6">
                    <div class="text-danger">Error loading users: {{users.error}}</div>
                </td>
            </tr>
            <tr>
                <td colspan="1">
                    <div class="text-danger align-left">Total: {{usersStore.total}}</div>
                </td>
                <td colspan="2">
                    <div class="text-danger align-left">
                        <select name="pageSize" class="form-control" @change="onChangePageSize($event);">
                            <option value="">selecte one</option>
                            <option 
                                v-for="size in usersStore.pageSizes" 
                                :key="size"
                                :value="size"
                                :selected="usersStore.pageSize === size"
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
                                v-for="page in usersStore.pageTotalRecords" 
                                :key="page"
                                :value="page"
                                :selected="usersStore.page === page"
                                :class="{ 'selected': usersStore.page === page }"
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
