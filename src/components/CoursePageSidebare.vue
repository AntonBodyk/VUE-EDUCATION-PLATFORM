<template>
  <div class="sidebar">
      <h1>{{course.course_price}}$</h1>
    <div class="add-to-cart">
      <a-space wrap>
        <a-button type="primary" class="add-to-cart-btn">Добавить в корзину</a-button>
      </a-space>
    </div>
    <div class="buy-now">
      <a-space wrap>
        <a-button type="primary" class="buy-now-btn">Купить сейчас</a-button>
      </a-space>
    </div>
    <div class="refund">
      <span>Гарантия возврата денег - 30 дней</span>
    </div>
    <div class="course-content">
      <h2>Этот курс включает:</h2>
      <ul class="course-content-list">
        <li>
          <img src="../../public/images/course-page-images/video.png" alt="упс...">
          <p>1,5 hours видео по запросу</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/data_download.png" alt="упс...">
          <p>2 ресурсов для скачивания</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/mobilephone.png" alt="упс...">
          <p>Доступ через мобильные устройства и телевизор</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/infinity_icon.png" alt="упс...">
          <p>Полный пожизненный доступ</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/trophy_winner.png" alt="упс...">
          <p>Сертификат об окончании</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";

export default {
  data(){
    return{
      course: []
    }
  },
  methods:{
    async getCourse(courseId){
      const courseResponse = await instance.get(`/courses/${courseId}`);
      console.log(courseResponse.data.data);
      this.course = courseResponse.data.data;
    }
  },
  mounted() {
    this.getCourse(this.$route.params.id);
  }
}
</script>

<style scoped>
.sidebar{
  width: 320px;
  height: 460px;
  margin: -51% 0 0 50%;
  position: fixed;
  box-shadow: 2px 2px 4px grey;
  border-radius: 5px;
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