<script setup>
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
    <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <div class="navbar-nav">
            <router-link to="/" class="nav-item nav-link">Home</router-link>
            <router-link to="/create_operation" class="nav-item nav-link">New Operation</router-link>
            <router-link to="/users" class="nav-item nav-link" v-if="authStore.isAdmin">Users</router-link>
            <router-link to="/operations" class="nav-item nav-link" v-if="authStore.isAdmin">Operations</router-link>
            <router-link to="/records" class="nav-item nav-link" v-if="authStore.isAdmin">Records</router-link>
            <button @click="authStore.logout()" class="btn btn-link nav-item nav-link">Logout</button>
        </div>
    </nav>
</template>