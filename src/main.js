import { createApp } from 'vue';
import { inject } from '@vercel/analytics';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { getSession } from './stores/session';

inject();
getSession();

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
