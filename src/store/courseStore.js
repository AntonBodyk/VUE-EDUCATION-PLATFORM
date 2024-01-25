import { defineStore } from 'pinia';

export const useCoursesStore = defineStore({
    state: () => ({
        courses: [],
    }),
    actions: {
        setCourses(newCourse) {
            this.courses = newCourse;
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
});