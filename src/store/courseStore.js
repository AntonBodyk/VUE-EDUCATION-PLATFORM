import { defineStore } from 'pinia';
import {instance} from "@/axios/axiosInstance";

export const useCoursesStore = defineStore( 'course', {
    state: () => ({
        courses: [],
        authUser: JSON.parse(localStorage.getItem('auth_user')) || null,
        searchQuery: '',
    }),
    actions: {
        setCourses(courses) {
            this.courses = courses;
        },
        async getCourses(){
            const coursesResponse = await instance.get('/courses');
            this.setCourses(coursesResponse.data.data);
        },
        async searchCourses(query) {
            try {
                const response = await instance.get('/courses/search', {
                    params: {searchQuery: query},
                });
                this.setCourses(response.data.data);
            } catch (error) {
                console.error('Ошибка при выполнении поиска курсов:', error);
                this.setCourses([]);
            }
        },
        addCourse(newCourse) {
            this.courses.push(newCourse);
        },
        removeCourse(courseId) {
            const index = this.courses.findIndex(course => course.id === courseId);
            if (index !== -1) {
                this.courses.splice(index, 1);
            }
        }
    },
    getters:{
        authorCourses(state){
            return state.courses.filter(course => course.author_id === state.authUser.id);
        },
    },
});