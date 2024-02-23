<template>
  <div v-if="categoryNotFound">
    <NotFoundPage/>
  </div>
    <div class="category-page" v-else>
      <h1 v-if="!showSpinner">Курсы в категории "{{coursesStore.courseCategoryName}}"</h1>
      <div class="courses-list-empty" v-if="showSpinner">
        <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
      <div class="courses-list-empty" v-if="!showSpinner && coursesStore.categoryCourses.length <= 0">
        <h2 class="courses-list-empty-title">Курсы не найдены!</h2>
      </div>
      <div class="category-courses" v-for="row in visibleCourseRows" :key="row[0].id" v-if="!showSpinner">
        <div class="course" v-for="course in row" :key="course.id" @click="navigateToCoursePage(course.id)">
          <img :src="course.course_img_url" alt="Sorry...">
          <h4>{{ course.title }}</h4>
          <span class="course-author">Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</span>
          <StarRating
              :rating="course.average_rating"
              :show-rating="false"
              :star-size="17"
              :read-only="true"/>
          <div class="course-price">{{course.course_price}}$</div>
        </div>
      </div>
      <a-space wrap v-if="!showSpinner">
        <a-button class="load-more-btn" type="primary" @click="loadMoreCourses" v-if="visibleCourseRows.length * coursesPerRow < coursesStore.categoryCourses.length">Еще</a-button>
      </a-space>
    </div>

</template>




<script>

import {useCoursesStore} from "@/store/courseStore";
import {instance} from "@/axios/axiosInstance";
import StarRating from 'vue-star-rating';
import router from "@/routes/router";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import {useRoute} from "vue-router";

export default {
  components:{
    StarRating, NotFoundPage
  },
  data(){
    return{
      coursesStore: useCoursesStore(),
      categoryCourse: [],
      coursesPerRow: 5,
      visibleCoursesCount: 15,
      showSpinner: false,
      categoryNotFound: false,
      route: useRoute(),
    }
  },
  methods: {
    async getCoursesByCategory() {
      const categoryId = this.$route.params.id;
      try {
        this.showSpinner = true;

        const categoryCoursesResponse = await instance.get(`/categories/${categoryId}/courses`);
        this.coursesStore.setCategoryCourses(categoryCoursesResponse.data.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.categoryNotFound = true;
        } else {
          console.error('Error fetching post data', error);
        }
      } finally {
        this.showSpinner = false;
      }
    },
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
      navigateToCoursePage(courseId){
        router.push(`/courses/${courseId}`);
      }
  },
  computed:{
    visibleCourseRows() {
      const courses = Array.isArray(this.coursesStore.categoryCourses) ? this.coursesStore.categoryCourses : [];
      const visibleCourses = courses.slice(0, this.visibleCoursesCount);
      return this.chunkArray(visibleCourses, this.coursesPerRow);
    },
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.getCoursesByCategory();
      }
    },
  },
  mounted() {
    this.getCoursesByCategory();
  }
}
</script>

<style scoped>
.category-page{
  font-family: "Rubik", sans-serif;
}
.category-page h1{
  font-weight: bold;
  margin: 20px 0 0 90px;
}
.category-courses{
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 20px 70px;
}
.course{
  width: 240px;
  margin: 20px 0 0 20px;
  cursor: pointer;
}
.course img{
  width: 240px;
}
.course h4{
  margin-top: 10px;
}
.course-author{
  color: grey;
  font-size: 12px;
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
.course-price{
  font-weight: bold;
  margin-top: 10px;
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

.courses-list-empty-title{
  margin: 20px 0 0 90px;
  color: red;
}
</style>