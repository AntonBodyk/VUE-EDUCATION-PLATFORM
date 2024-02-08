import { defineStore } from 'pinia';
import router from "@/routes/router";

export const useStudentCourseStore = defineStore({
    id: 'student-course',
    state: () => ({
        courses: []
    }),
    actions: {

    }
});