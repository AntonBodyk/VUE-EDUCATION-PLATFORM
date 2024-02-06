<template>
  <div class="lesson-page">
    <div class="courses-list-empty" v-if="showSpinner">
      <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="lesson-page-block" v-if="!showSpinner">
      <h1>{{lesson.title}}</h1>
      <video :src="lesson.lesson_video_url" controls></video>
      <div class="lesson-description">
        <h2>Описание урока</h2>
        <p>{{lesson.description}}</p>
      </div>
      <div class="lesson-exercise">
        <h2>Задание</h2>
        <a href=#>Cкачать задание</a>
      </div>
    </div>
  </div>
</template>



<script>
import {instance} from "@/axios/axiosInstance";
import {message} from "ant-design-vue";
export default {
  data(){
    return{
        lesson: [],
        showSpinner: false
    }
  },
  methods:{
    async getLesson(lessonId){
      try {
        this.showSpinner = true;

        const lessonsResponse = await instance.get(`/lessons/${lessonId}`);
        this.lesson = lessonsResponse.data.data;
      }catch (e) {
        message.error('Ошибка при получении урока!');
      }finally {
        this.showSpinner = false;
      }
    }
  },
  mounted() {
    this.getLesson(this.$route.params.id);
  }
}
</script>


<style scoped>
.lesson-page{
  font-family: "Rubik", sans-serif;
}
.lesson-page h1{
  font-size: 40px;
  text-align: center;
  margin-top: 30px;
}
.lesson-page video{
  width: 500px;
  margin: 20px 0 0 33%;
}
.lesson-description{
  margin: 20px 0 0 33%;
  width: 500px;
}
.lesson-exercise{
  margin: 20px 0 20px 33%;
}
.lesson-exercise a{
  text-decoration: none;
  color: grey;
}
.lesson-exercise a:hover{
  color: #364d79;
}
.lds-default {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 10% 0 0 48%;
}
.lds-default div {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #364d79;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>