import { defineStore } from 'pinia';
import {instance} from "@/axios/axiosInstance";


export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('auth_token') || null,
        user: JSON.parse(localStorage.getItem('auth_user')) || null,
    }),
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('auth_token', token);
        },
        setUser(user) {
            this.user = user.user;
            localStorage.setItem('auth_user', JSON.stringify(user.user));
        },
        updateUserLocally(updatedUserData) {
            this.setUser(updatedUserData);
        },
        clearToken() {
            this.token = null;
            localStorage.removeItem('auth_token');
        },
        clearAuthUser(){
            this.user = null;
            localStorage.removeItem('auth_user');
        }
    },
});



export function setupUserStore() {
    return useUserStore();
}