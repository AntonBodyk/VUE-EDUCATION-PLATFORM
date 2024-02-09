import { defineStore } from 'pinia';
import {instance} from "@/axios/axiosInstance";

export const useCoursesStore = defineStore( 'course', {
    state: () => ({
        courses: [],
        categoryCourses: [],
        courseCategoryName: '',
        authUser: JSON.parse(localStorage.getItem('auth_user')) || null,
        searchQuery: '',
        studentCourses: []
    }),
    actions: {
        setCourses(courses) {
            this.courses = courses;
        },
        setCategoryCourses(categoryCourses){
            this.categoryCourses = categoryCourses;
        },
        setStudentCourses(studentCourses){
            this.studentCourses = studentCourses;
        },
        async getCourses(){
            const coursesResponse = await instance.get('/courses');
            this.setCourses(coursesResponse.data.data);
        },
        async searchCourses(query) {
            try {
                if(query !== ''){
                    const response = await instance.get('/courses/search', {
                        params: {searchQuery: query},
                    });
                    this.setCourses(response.data.data);
                    this.setCategoryCourses(response.data.data);
                    this.setStudentCourses(response.data.data);
                }
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
        filterStudentCourses(state){
            if (state.studentCourses && state.authUser) {
                return state.studentCourses.filter(course => course.pivot.user_id === state.authUser.id);
            } else {
                return [];
            }
        }
    },
});