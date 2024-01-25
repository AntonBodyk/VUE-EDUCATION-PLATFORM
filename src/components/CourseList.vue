<template>
  <div>
    <div class="course-list" v-for="row in visibleCourseRows" :key="row[0].id">
      <div class="course" v-for="course in row" :key="course.id">
        <img :src="course.course_img_url" alt="Sorry...">
        <h4>{{ course.title }}</h4>
        <span>Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</span>
      </div>
    </div>
    <a-space wrap>
      <a-button class="load-more-btn" type="primary" @click="loadMoreCourses" v-if="visibleCourseRows.length * coursesPerRow < courses.length">Еще</a-button>
    </a-space>
  </div>
</template>


<script>
import {instance} from "@/axios/axiosInstance";

export default {
  data(){
      return{
        courses: [],
        coursesPerRow: 5,
        visibleCoursesCount: 15,
      }
  },
  methods: {
    async getCourses(){
      const coursesResponse = await instance.get('/courses');
      this.courses = coursesResponse.data.data;
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
  computed: {
    visibleCourseRows() {
      const visibleCourses = this.courses.slice(0, this.visibleCoursesCount);
      return this.chunkArray(visibleCourses, this.coursesPerRow);
    },
  },
  mounted() {
    this.getCourses();
  }
}
</script>


<style scoped>
.course-list{
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 0 60px;
}
.course{
  width: 240px;
  margin: 20px 0 0 20px;
}
.load-more-btn{
  background-color: #364d79;
  font-family: "Rubik", sans-serif;
  width: 200px;
  height: 50px;
  margin: 30px 0 30px 620px;
}
.load-more-btn:hover{
  background-color: azure;
  color: black;
}
</style>