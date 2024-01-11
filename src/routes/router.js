import MainPage from '@/pages/MainPage';

import SignPage from '@/pages/SignPage';
// import NotFoundPage from '@/pages/NotFoundPage';
import RegistrationPage from '@/pages/RegistrationPage';
import { createRouter, createWebHistory } from 'vue-router';
// import { useUserStore } from '@/store/user';
import { message } from 'ant-design-vue';

function adminRouteGuard(to, from, next) {
    const userStore = useUserStore();
    const userRole = userStore.user ? userStore.user.role : null;

    if (userRole === 'admin') {
        next();
    } else {
        next({name: 'NotFoundPage'});
        message.error('Вы не являетесь админом!');
    }
}

const routes = [
    {
        path: '/',
        component: MainPage
    },
    {
        path: '/sign',
        component: SignPage
    },
    {
        path: '/registration',
        component: RegistrationPage
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFoundPage',
        component: NotFoundPage,
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;