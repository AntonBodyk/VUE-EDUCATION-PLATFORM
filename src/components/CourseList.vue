<template>
  <div class="courses-list-empty" v-if="this.coursesStore.courses.length <= 0">
    <h2 class="courses-list-empty-title">Курсов нет!</h2>
  </div>
  <div>
    <div class="course-list" v-for="row in visibleCourseRows" :key="row[0].id">
      <div class="course" v-for="course in row" @click="navigateToCoursePage(course.id)" :key="course.id">
        <img :src="course.course_img_url"  alt="Sorry...">
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
      </div>
    </div>
    <a-space wrap>
      <a-button class="load-more-btn" type="primary" @click="loadMoreCourses" v-if="shouldShowLoadMoreButton">Еще</a-button>
    </a-space>
  </div>
</template>


<script>
import {useCoursesStore} from "@/store/courseStore";
import router from "@/routes/router";
import StarRating from 'vue-star-rating';
export default {
  components:{
    StarRating
  },
  data(){
      return{
        coursesStore: useCoursesStore(),
        coursesPerRow: 5,
        visibleCoursesCount: 15,
        rating: 0
      }
  },
  methods: {
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
  computed: {
    visibleCourseRows() {
      const courses = this.coursesStore.courses || [];
      const visibleCourses = courses.slice(0, this.visibleCoursesCount);
      return this.chunkArray(visibleCourses, this.coursesPerRow);
    },
    shouldShowLoadMoreButton() {
      return (
          this.visibleCourseRows.length * this.coursesPerRow < (this.coursesStore.courses ? this.coursesStore.courses.length : 0)
      );
    },
  },
  mounted() {
    this.coursesStore.getCourses();
  }
}
</script>


<style scoped>
.course-list{
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
.courses-list-empty-title{
  text-align: center;
  margin-top: 20px;
  color: red;
}
.course-rating{
  margin-top: 5px;
}
</style>