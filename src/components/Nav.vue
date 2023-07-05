<script setup>
import { useAuthStore } from '@/stores';

const authStore = useAuthStore();
</script>

<template>
    <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <router-link to="/" class="navbar-brand"><img src="https://www.truenorth.co/favicon-32x32.png" alt="TrueNorth"/> TrueNorth</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item">
                    <router-link to="/users" class="nav-item nav-link" v-if="authStore.isAdmin">Users</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/operations" class="nav-item nav-link" v-if="authStore.isAdmin">Operation's Type</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/records" class="nav-item nav-link">Records</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/create_operation"  v-if="authStore.isAdmin" class="nav-item nav-link">New UI</router-link>
                </li>
            </ul>
            <form onsubmit="return false;" class="form-inline my-2 my-lg-0">
                <button @click="authStore.logout()" class="btn btn-link nav-item nav-link">Logout</button>
            </form>
        </div>

        
    </nav>
</template>