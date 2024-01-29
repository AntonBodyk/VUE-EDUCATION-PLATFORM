<template>
    <div class="category-page">
      <h1>Курсы в категории ""</h1>
      <div class="courses-list-empty" v-if="this.coursesStore.courses.length <= 0">
        <h2 class="courses-list-empty-title">У Вас нет таких курсов!</h2>
      </div>
      <div class="category-courses" v-for="row in visibleCourseRows" :key="row[0].id">
        <div class="course" v-for="course in row" :key="course.id">
          <img :src="course.course_img_url" alt="Sorry...">
          <h4>{{ course.title }}</h4>
          <span class="course-author">Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</span>
          <div class="course-price">{{course.course_price}}$</div>
        </div>
      </div>
      <a-space wrap>
        <a-button class="load-more-btn" type="primary" @click="loadMoreCourses" v-if="visibleCourseRows.length * coursesPerRow < categoryCourse.length">Еще</a-button>
      </a-space>
    </div>

</template>




<script>

import {useCoursesStore} from "@/store/courseStore";

export default {
  data(){
    return{
      coursesStore: useCoursesStore(),
      categoryCourse: [],
      coursesPerRow: 5,
      visibleCoursesCount: 15,
    }
  },
  methods: {
    getCoursesByCategory() {
      const categoryId = Number(this.$route.params.id);

      this.categoryCourse = this.coursesStore.courses.filter(course => {
        return course.category_id === categoryId;
      });

      console.log('Filtered Courses:', this.categoryCourse);
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
  },
  computed:{
    visibleCourseRows() {
      const courses = this.categoryCourse || [];
      const visibleCourses = courses.slice(0, this.visibleCoursesCount);
      return this.chunkArray(visibleCourses, this.coursesPerRow);
    },
  },
  mounted() {
    this.getCoursesByCategory();
  }
}
</script>

<style scoped>
.authored-courses h1{
  font-family: "Rubik", sans-serif;
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
.courses-list-empty-title{
  margin: 20px 0 0 90px;
  color: red;
}
.course-price{
  font-weight: bold;
  margin-top: 10px;
}
</style>