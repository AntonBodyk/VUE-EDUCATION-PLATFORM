import SignPage from '@/pages/SignPage';
import RegistrationPage from '@/pages/RegistrationPage';
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "@/pages/MainPage.vue";
import UserPage from "@/pages/UserPage.vue";
import MyCourses from "@/pages/MyCourses.vue";
import CategoryCoursesPage from "@/pages/CategoryCoursesPage.vue";
import NewCoursePage from "@/pages/NewCoursePage.vue";
import CoursePage from "@/pages/CoursePage.vue";
import CartPage from "@/pages/CartPage.vue";
import NewLessonPage from "@/pages/NewLessonPage.vue";
import LessonPage from "@/pages/LessonPage.vue";
import VideoRecordPage from "@/pages/VideoRecordPage.vue";
import MyLearningPage from "@/pages/MyLearningPage.vue";
import QuizPage from "@/pages/QuizPage.vue";
import NotFoundPage from '@/pages/NotFoundPage.vue';
import NewTestPage from "@/pages/NewTestPage.vue";



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
        path: '/quiz',
        component: QuizPage
    },
    {
        path: '/registration',
        component: RegistrationPage
    },
    {
        path: '/record-video',
        component: VideoRecordPage
    },
    {
        path: '/new-course',
        component: NewCoursePage
    },
    {
        path: '/new-test/:id',
        component: NewTestPage
    },
    {
        path: '/users/:id',
        component: UserPage
    },
    {
        path: '/users/:id/courses',
        component: MyCourses
    },
    {
        path: '/users/:id/learning',
        component: MyLearningPage
    },
    {
        path: '/courses/:id',
        component: CoursePage
    },
    {
        path: '/cart',
        component: CartPage
    },
    {
        path: '/new-lesson/:id',
        component: NewLessonPage
    },
    {
        path: '/lessons/:id',
        component: LessonPage
    },
    {
        path: '/categories/:id',
        component: CategoryCoursesPage,
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