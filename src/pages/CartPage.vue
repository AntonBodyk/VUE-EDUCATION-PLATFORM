<template>
  <div class="cart-page">
    <div class="cart-order-sum">
      <h1>Корзина</h1>
      <div class="order-sum" v-if="cartStore.cartCourses.length > 0">
        <p>Итого: {{totalCartAmount}}$</p>
        <a-space wrap>
          <a-button type="primary" class="order-pay-btn" @click="checkUserSign">Оплатить</a-button>
        </a-space>
      </div>
    </div>

    <div class="cart-contents" v-if="cartStore.cartCourses.length === 0">
      <div>
        <img class="no-courses-img" src="../../public/images/cart-images/empty-shopping-cart-v2.jpg" alt="упс...">
      </div>
      <div>
        <span class="no-courses-text">Корзина пуста. Добавьте курсы!</span>
      </div>
    </div>
    <div class="cart-course-list" v-for="row in visibleCourseRows" :key="row[0].id">
      <div class="course" v-for="course in row" :key="course.id">
        <img :src="course.course_img_url"  alt="Sorry..." @click="navigateToCoursePage(course.id)">
        <h4>{{ course.title }}</h4>
        <span class="course-author">Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</span>
        <div class="course-rating">
          <StarRating
              :rating="course.average_rating"
              :show-rating="false"
              :star-size="17"
              :read-only="true"/>
        </div>
        <div class="course-price">{{course.course_price}}$</div>
        <a-space warp>
          <a-button type="link" danger class="del-student-course-btn" @click="cartStore.removeFromCart(course.id)">Удалить</a-button>
        </a-space>
      </div>
    </div>
    <a-space wrap>
      <a-button class="load-more-btn" type="primary" @click="loadMoreCourses" v-if="shouldShowLoadMoreButton">Еще</a-button>
    </a-space>
  </div>

</template>


<script>
import {instance} from "@/axios/axiosInstance";
import {useCartStore} from "@/store/cartStore";
import StarRating from "vue-star-rating";
import {useUserStore} from "@/store/userStore";
import router from "@/routes/router";
import {message} from "ant-design-vue";

export default {
  components: {StarRating},
  data(){
    return{
      cartStore: useCartStore(),
      userStore: useUserStore(),
      coursesPerRow: 5,
      visibleCoursesCount: 15,
    }
  },
  methods:{
    loadMoreCourses() {
      this.visibleCoursesCount += 15;
    },
    chunkArray(arr, size) {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
    },
    async checkUserSign() {
        if (this.userStore.user) {
          try {
            if (this.userStore.user.role_id === 2) {
              message.error('Для покупки курса необходимо быть студентом.');
              return;
            }

            const response = await instance.post('/enroll-courses', {
              user_id: this.userStore.user.id,
              course_ids: this.cartStore.cartCourses.map(course => course.id)
            });


            this.cartStore.clearCart();

            const studentId = this.userStore.user.id;
            router.push(`/users/${studentId}/learning`);
            message.success('Спасибо за покупку!');

          } catch (error) {
            console.error('Ошибка покупки курсов:', error);
          }
        } else {
          router.push('/registration');
        }
    },
    navigateToCoursePage(courseId){
      router.push(`/courses/${courseId}`);
    }
  },
  computed:{
    visibleCourseRows() {
      const courses = this.cartStore.cartCourses || [];
      const visibleCourses = courses.slice(0, this.visibleCoursesCount);
      return this.chunkArray(visibleCourses, this.coursesPerRow);
    },
    shouldShowLoadMoreButton() {
      return (
          this.visibleCourseRows.length * this.coursesPerRow < (this.cartStore.cartCourses ? this.cartStore.cartCourses : 0)
      );
    },
    totalCartAmount() {
      if (this.cartStore.cartCourses.length === 0) return 0;
      let totalAmount = this.cartStore.cartCourses.reduce((total, course) => total + parseFloat(course.course_price), 0);
      return totalAmount.toFixed(2);
    },
  }
}
</script>


<style scoped>
.del-student-course-btn{
  margin-left: -15px;
}
.cart-page{
  font-family: "Rubik", sans-serif;
}
.cart-page h1{
  margin: 20px 0 0 90px;
  font-size: 40px;
}
.cart-course-list{
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 20px 70px;
}
.course{
  width: 240px;
  cursor: pointer;
  margin: 20px 0 0 20px;
}
.course img{
  width: 240px;
}
.course h4{
  margin-top: 10px;
}
.load-more-btn{
  background-color: #364d79;
  font-family: "Rubik", sans-serif;
  width: 200px;
  height: 50px;
  margin: 30px 0 30px 640px;
}
.load-more-btn:hover{
  background-color: azure;
  color: black;
}
.course-author{
  color: grey;
  font-size: 12px;
}
.course-price{
  font-weight: bold;
  margin-top: 10px;
}
.course-rating{
  margin-top: 5px;
}
.no-courses-img{
  margin-left: 40%;
}
.no-courses-text{
  margin-left: 40%;
}
.cart-order-sum{
  display: flex;
}
.order-sum{
  display: flex;
  margin-left: 52%;
}
.order-sum p{
  font-size: 30px;
  font-weight: bold;
  margin-top: 30px;
}
.order-pay-btn{
  margin: 0 0 8px 20px;
}
</style>