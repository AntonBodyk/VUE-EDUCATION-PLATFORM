<template>
  <div class="authored-courses">
    <h1>Мои курсы:</h1>
    <div class="courses-list-empty" v-if="this.coursesStore.courses.length <= 0">
      <h2 class="courses-list-empty-title">У Вас нет таких курсов!</h2>
    </div>
    <div class="teacher-courses" v-for="row in visibleCourseRows" :key="row[0].id">
      <div class="course" v-for="course in row" :key="course.id">
        <img :src="course.course_img_url" alt="Sorry...">
        <h4>{{ course.title }}</h4>
        <span class="course-author">Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</span>
        <a-space warp>
          <a-button type="primary" class="delete-course-btn" @click="showModal(course.id)" danger>Удалить курс</a-button>
        </a-space>
        <a-modal v-model:open="open" title="Подтвердите удаление">
          <a-space class="modal-btns">
            <a-button type="primary" @click="closeModal" ghost>Нет</a-button>
            <a-button type="primary" danger ghost @click="deleteCourse(), closeModal()">Да</a-button>
          </a-space>
          <template #footer>

          </template>
        </a-modal>
      </div>
    </div>
    <a-space wrap>
      <a-button class="load-more-btn" type="primary" @click="loadMoreCourses" v-if="visibleCourseRows.length * coursesPerRow < coursesStore.authorCourses.length">Еще</a-button>
    </a-space>
  </div>
</template>



<script>
import {useCoursesStore} from "@/store/courseStore";
import {instance} from "@/axios/axiosInstance";
import {message} from "ant-design-vue";

export default {
  data(){
    return{
      coursesPerRow: 5,
      visibleCoursesCount: 15,
      coursesStore: useCoursesStore(),
      open: false,
      deleteCourseId: null
    }
  },
  methods:{
    showModal(courseId){
      this.open = true;
      this.deleteCourseId = courseId;
    },
    closeModal(){
      this.open = false;
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
    async deleteCourse(){
        const courseId = this.deleteCourseId;
        const deleteCourseResponse = await instance.delete(`courses/${courseId}`);
        if (deleteCourseResponse.status === 200){
          this.coursesStore.removeCourse(courseId);
          message.success('Курс успешно удален');
        }else{
          message.error('Ошибка при удалении курса');
        }
    }
  },
  computed:{
    visibleCourseRows() {
      const courses = this.coursesStore.authorCourses || [];
      const visibleCourses = courses.slice(0, this.visibleCoursesCount);
      return this.chunkArray(visibleCourses, this.coursesPerRow);
    },
  }
}
</script>


<style scoped>
.authored-courses{
  font-family: "Rubik", sans-serif;
}
.authored-courses h1{
  font-family: "Rubik", sans-serif;
  font-weight: bold;
  margin: 20px 0 0 90px;
}
.teacher-courses{
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
.delete-course-btn{
  font-family: "Rubik", sans-serif;
  margin-top: 10px;
}

.modal-btns{
  margin-top: 10px;
}
</style>