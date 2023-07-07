<script setup>
import { useAuthStore } from '@/stores';
import { router } from '@/router';

// redirect home if already logged in
const authStore = useAuthStore();
if (authStore.user) {
    router.push('/');
}
</script>

<template>
    <div class="row">
        <div class="col-sm-8 offset-sm-2 mt-5">
            <router-view />
        </div>
    </div>
</template>
