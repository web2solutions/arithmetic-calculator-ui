import { Layout, List, AddEdit } from '@/views/records';

export default {
    path: '/records',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
