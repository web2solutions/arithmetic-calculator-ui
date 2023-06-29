import { Layout, List, AddEdit } from '@/views/operations';

export default {
    path: '/operations',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
