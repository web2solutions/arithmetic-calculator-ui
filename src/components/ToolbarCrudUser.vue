<script setup>
import Swal from 'sweetalert2';
import { router } from '@/router';
import { useUsersStore } from '@/stores';

const html = `
        <form style='text-align: left;'>
            <label>Username</label>
            <input class="form-control" type="text" name="username" id="search_username" placeholder="type an username" /> <br/>
            <label>User type</label>
            <select class="form-control" name="admin" id="search_admin">
                <option value="">select one</option>
                <option value="true">admin</option>
                <option value="false">user</option>
            </select>
        </form>
`;

async function onClickOpenSearch() {
    const { isConfirmed } = await Swal.fire({
        title: 'User search',
        html,
        confirmButtonText: 'search',
        showCancelButton: true,
        customClass: {
            confirmButton: 'btn btn-sm btn-success mb-2',
            cancelButton: 'btn btn-sm mb-2',
        }
    });
    if (isConfirmed) {
        useUsersStore.user = { loading: true };
        const username = document.getElementById('search_username').value;
        const admin = document.getElementById('search_admin').value;
        console.log({ username, admin })
        const query = {
            filter: {},
        };

        if (username && username !== '') query.filter['username'] = username
        if (admin && admin !== '') query.filter['admin'] = admin === 'true' ? true : false;

        const safe = {
            filter: window.btoa(JSON.stringify({ ...query.filter })),
        };
        
        router.push({ path: '/users', query: safe })
    }
}
</script>

<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark navbar_sub">
        <h1 class="navbar-brand">Users</h1>
        <router-link to="/users/add" class="btn btn-sm btn-success mb-2">Add User</router-link>
        <button @click="onClickOpenSearch($event)" class="btn btn-sm btn-warning mb-2">Search</button>
    </nav>
</template>
<style>
@import '@/assets/layout.css';
</style>
