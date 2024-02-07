import { defineStore } from 'pinia';

export const useCartStore = defineStore({
    id: 'cart',
    state: () => ({
        cartCourses: []
    }),
    actions: {
        addToCart(course) {
            this.cartCourses.push(course);
        },
        removeFromCart(index) {
            this.cartCourses.splice(index, 1);
        },
        clearCart() {
            this.cartCourses = [];
        }
    }
});