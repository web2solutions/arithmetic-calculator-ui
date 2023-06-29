import { Layout, CreateOperation } from '@/views/operations';

export default {
    path: '/create_operation',
    component: Layout,
    children: [
        { path: '', component: CreateOperation },
    ]
};
