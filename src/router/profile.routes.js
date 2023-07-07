import { LayoutProfile, Profile } from '@/views/account';

export default {
    path: '/profile',
    component: LayoutProfile,
    children: [
        { path: '', component: Profile },
    ]
};
