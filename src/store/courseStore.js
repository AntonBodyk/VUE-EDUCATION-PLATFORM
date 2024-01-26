import { defineStore } from 'pinia';

export const useCoursesStore = defineStore( 'course', {
    state: () => ({
        courses: [],
        authUser: JSON.parse(localStorage.getItem('auth_user')) || null
    }),
    actions: {
        setCourses(courses) {
            this.courses = courses;
        },
        addCourse(newCourse) {
            this.courses.push(newCourse);
        },
        removeCourse(courseId) {
            const index = this.courses.findIndex(course => course.id === courseId);
            if (index !== -1) {
                this.courses.splice(index, 1);
            }
        },
    },
    getters:{
        authorCourses(state){
            return state.courses.filter(course => course.author_id === state.authUser.id);
        },
    },
});