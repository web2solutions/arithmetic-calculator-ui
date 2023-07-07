<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
    <div v-if="user">
        <h1>Hi {{user.username}}!</h1>
        <p>You're logged as {{user.admin ? 'admin' : 'user'}}.</p>
        <p><router-link v-if="user.admin" to="/users">Manage Users</router-link></p>
        <p><router-link v-if="user.admin" to="/operations">Manage Operations</router-link></p>
        <p><router-link to="/records">See all my calculations</router-link></p>
        <p><router-link to="/records/add">Add new calculation</router-link></p>

        <p><router-link to="/profile">Manage my profile</router-link></p>

        <!-- <p><router-link v-if="user.admin" to="/create_operation">New Calcultator UI - POC only</router-link></p> -->
    </div>
</template>
