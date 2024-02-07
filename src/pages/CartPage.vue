<template>
  <div class="cart-page">
    <h1>Корзина</h1>
    <div class="cart-contents" v-if="cartStore.cartCourses.length === 0">
      <div>
        <img class="no-courses-img" src="../../public/images/cart-images/empty-shopping-cart-v2.jpg" alt="упс...">
      </div>
      <div>
        <span class="no-courses-text">Корзина пуста. Добавьте курсы!</span>
      </div>
    </div>
    <div class="shopping-items" v-if="cartStore.cartCourses.length > 0" v-for="item in this.cartStore.cartCourses">
      <div class="shopping-item">
        <img :src="item.course_img_url" alt="упс..." class="shopping-item-image">
        <h2 class="shopping-item-title">{{item.title}}</h2>
      </div>
    </div>
  </div>

</template>


<script>
import {useCartStore} from "@/store/cartStore";
export default {
  data(){
    return{
      cartStore: useCartStore()
    }
  }
}
</script>


<style scoped>
.cart-page{
  font-family: "Rubik", sans-serif;
}
.cart-page h1{
  margin: 20px 0 0 50px;
  font-size: 40px;
}
.no-courses-img{
  margin-left: 40%;
}
.no-courses-text{
  margin-left: 40%;
}
</style>