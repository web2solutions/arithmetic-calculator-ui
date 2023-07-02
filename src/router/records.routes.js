import { Layout, List, Add } from '@/views/records';

export default {
    path: '/records',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: Add }
    ]
};
