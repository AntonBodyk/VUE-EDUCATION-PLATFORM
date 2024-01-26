import SignPage from '@/pages/SignPage';
// import NotFoundPage from '@/pages/NotFoundPage';
import RegistrationPage from '@/pages/RegistrationPage';
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "@/pages/MainPage.vue";
import UserPage from "@/pages/UserPage.vue";
import MyCourses from "@/pages/MyCourses.vue";



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
        path: '/users/:id',
        component: UserPage
    },
    {
        path: '/users/:id/courses',
        component: MyCourses
    },

];

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;