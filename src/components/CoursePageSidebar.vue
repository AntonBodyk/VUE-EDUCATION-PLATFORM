<template>
  <div class="sidebar">
      <h1>{{course.course_price}}$</h1>
    <div class="add-to-cart" v-if="!cartStore.isAddedToCart(course)">
      <a-space wrap>
        <a-button type="primary" class="add-to-cart-btn" @click="cartStore.addToCart(course)">Добавить в корзину</a-button>
      </a-space>
    </div>
    <div class="add-to-cart" v-else>
      <a-button type="primary" class="add-to-cart-btn" @click="goToCart" >Перейти в корзину</a-button>
    </div>
    <div class="buy-now">
      <a-space wrap>
        <a-button type="primary" class="buy-now-btn" @click="checkUserSign">Купить сейчас</a-button>
      </a-space>
    </div>
    <div class="refund">
      <span>Гарантия возврата денег - 30 дней</span>
    </div>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";
import {useUserStore} from "@/store/userStore";
import {useCartStore} from "@/store/cartStore";
import router from "@/routes/router";
import {message} from "ant-design-vue";

export default {
  props:{
    course: Object
  },
  data(){
    return{
      userStore: useUserStore(),
      cartStore: useCartStore()
    }
  },
  methods:{
    async checkUserSign() {
      if (this.userStore.user) {
        try {

          if (this.userStore.user.role_id === 2) {
            message.error('Для покупки курса необходимо быть студентом.');
            return;
          }

          const response = await instance.post("/enroll-courses", {
            user_id: this.userStore.user.id,
            course_ids: [this.course.id]
          });

          console.log(response.data.message);

          router.push("/");
          message.success('Спасибо за покупку!');

        } catch (error) {
          console.error("Ошибка покупки курса:", error);
        }
      } else {
        router.push("/registration");
      }
    },
    goToCart(){
      router.push('/cart');
    }
  }
}
</script>

<style scoped>
.sidebar{
  width: 320px;
  height: 250px;
  position: absolute;
  box-shadow: 2px 2px 4px grey;
  border-radius: 5px;
  left: 50%;
  bottom: 50%;

}
.sidebar span{
  color: grey;
  font-size: 14px;
}
.refund{
  margin: 20px 0 0 40px;
}
.sidebar h1{
  padding: 20px 0 0 20px;
}
.sidebar .add-to-cart {
  padding: 20px 0 0 20px;
}
.sidebar .add-to-cart-btn {
  width: 280px;
  height: 50px;
  background-color: blueviolet;
}
.sidebar .buy-now {
  padding: 20px 0 0 20px;
}
.sidebar .buy-now-btn {
  width: 280px;
  height: 50px;
}
.course-content h2{
  font-size: 20px;
  margin: 10px 0 0 20px;
}
.course-content-list{
  list-style-type: none;
}
.course-content-list li {
  display: flex;
  width: 220px;
  margin: 10px 0 0 -20px;
}
.course-content-list img{
  width: 20px;
  height: 20px;
}
.course-content-list img:nth-child(3){
  margin-top: 5px;
}
.course-content-list img:nth-child(4){
  padding-top: 5px;
}
.course-content-list p{
  font-size: 14px;
  color: grey;
  margin: 3px 0 0 10px;
}
</style>