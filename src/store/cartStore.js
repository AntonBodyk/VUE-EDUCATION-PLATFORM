import { defineStore } from 'pinia';

export const useCartStore = defineStore({
    id: 'cart',
    state: () => ({
        cartCourses: JSON.parse(localStorage.getItem('cartCourses')) || [],
    }),
    actions: {
        addToCart(course) {
            this.cartCourses.push(course);
            this.saveCartToLocalStorage();
        },
        isAddedToCart(course) {
            return this.cartCourses.some(cartCourse => cartCourse.id === course.id);
        },
        removeFromCart(courseId) {
            const index = this.cartCourses.findIndex(course => course.id === courseId);
            if (index !== -1) {
                this.cartCourses.splice(index, 1);
                this.saveCartToLocalStorage();
            }
        },
        clearCart() {
            this.cartCourses = [];
            this.saveCartToLocalStorage();
        },
        saveCartToLocalStorage() {
            localStorage.setItem('cartCourses', JSON.stringify(this.cartCourses));
        }
    }
});