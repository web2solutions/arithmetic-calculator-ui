<script setup>
import Swal from 'sweetalert2';
import { router } from '@/router';
import { useRecordsStore } from '@/stores';

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

async function onClickOpenSearch(e) {
    const { isConfirmed, isDismissed } = await Swal.fire({

        // icon: 'success',
        title: 'User search',
        html,
        // text: 'Do you want to continue',
        confirmButtonText: 'search',
        showCancelButton: true,
        customClass: {
            confirmButton: 'btn btn-sm btn-success mb-2',
            cancelButton: 'btn btn-sm mb-2',
        }
    })
    console.log({ isConfirmed, isDismissed })

    if (isConfirmed) {
        useRecordsStore.user = { loading: true };
        // do search
        // const previousPage = router.currentRoute._value.query.page || false;
        // const previousSize = router.currentRoute._value.query.size || false;
        const username = document.getElementById('search_username').value;
        const admin = document.getElementById('search_admin').value;
        console.log({ username, admin })
        const query = {
            // size: +event.target.value
            filter: {},
        };
        // if (previousPage) query.page = previousPage;
        // if (previousSize) query.size = previousSize;
        if (username && username !== '') query.filter['username'] = username
        if (admin && admin !== '') query.filter['admin'] = admin === 'true' ? true : false;

        const safe = {
            filter: window.btoa(JSON.stringify({ ...query.filter })),
        };

        // Buffer.from('Hello World!').toString('base64')

        // useUsersStore.filter = window.btoa(JSON.stringify({ ...query.filter }));

        console.log(query, safe)
        
        router.push({ path: '/users', query: safe })
    }
}
</script>

<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark navbar_sub">
        <h1 class="navbar-brand">Calculated operations</h1>
        <router-link to="/records/add" class="btn btn-sm btn-success mb-2">Add new calculation</router-link>
        <button @click="onClickOpenSearch($event)" class="btn btn-sm btn-warning mb-2">Search</button>
    </nav>
</template>
<style>
@import '@/assets/layout.css';
</style>
