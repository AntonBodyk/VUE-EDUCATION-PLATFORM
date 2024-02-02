<template>
  <div class="cart-page">
    <h1>Корзина</h1>
    <div class="cart-contents" v-if="cartCourses.length === 0">
      <div>
        <img class="no-courses-img" src="../../public/images/cart-images/empty-shopping-cart-v2.jpg" alt="упс...">
      </div>
      <div>
        <span class="no-courses-text">Корзина пуста. Добавьте курсы!</span>
      </div>
    </div>
  </div>

</template>


<script>
export default {
  data(){
    return{
      cartCourses: []
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