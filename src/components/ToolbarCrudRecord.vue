<script setup>
import Swal from 'sweetalert2';
import { router } from '@/router';
import { useRecordsStore, useOperationsStore } from '@/stores';

const operationsStore = useOperationsStore();


async function onClickOpenSearch(e) {
    await operationsStore.getAll();
    let optionsString = '';
    [...operationsStore.operations].forEach((o) => {
        optionsString += `
            <option value="['${o._id}', '${o.type}']">${o.type}</option>
        `;
    })
    const html = `
        <form style='text-align: left;'>
            <label>Username</label>
            <input class="form-control" type="text" name="username" id="search_username" placeholder="type an username" /> <br/>
            <label>Operation type</label>
            <select class="form-control" name="operation_id" id="operation_id">
                <option value="">select one</option>
                ${optionsString}
            </select>
        </form>
    `;
    const { isConfirmed, isDismissed } = await Swal.fire({
        title: 'Operation search',
        html,
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
        
        const username = document.getElementById('search_username').value;
        const operation_id = document.getElementById('operation_id').value;
        console.log({ username, operation_id })
        const query = {
            filter: {},
        };
        
        if (username && username !== '') query.filter['user_id.username'] = username
        if (operation_id && operation_id !== '') query.filter['operation_id'] = operation_id;

        const safe = {
            filter: window.btoa(JSON.stringify({ ...query.filter })),
        };
        
        router.push({ path: '/records', query: safe })
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
