<template>
  <div v-if="courseNotFound">
    <NotFoundPage></NotFoundPage>
  </div>
  <div class="course-page" v-else>
    <div class="courses-list-empty" v-if="showSpinner">
      <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="course-page-content" v-if="!showSpinner">
      <h1 class="course-title">{{course.title}}</h1>
      <p v-if="course.author" class="course-author">Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</p>

      <div class="course-structure">
        <h2>Материалы курса</h2>

        <div class="course-lessons">
          <div class="add-new-lesson" v-if="isCourseCreator">
            <a-space wrap>
              <a-button type="primary" class="add-new-lesson-btn" @click="navigateToNewLesson(this.$route.params.id)">Добавить урок</a-button>
            </a-space>
          </div>
          <div class="course-lessons-block" v-for="lesson in lessons" :key="lesson.id">
             <div class="lesson-title" @click="navigateToLesson(lesson.id), markLessonCompleted(lesson.id)">{{lesson.title}}</div>
             <span v-if="lesson.completed === 1">✓</span>
              <a-space wrap v-if="isCourseCreator">
                <a-button danger class="del-lesson" @click="showModal(lesson.id)">Удалить</a-button>
              </a-space>
              <a-modal v-model:open="open" title="Подтвердите удаление">
                <a-space class="modal-btns">
                  <a-button type="primary" @click="closeModal" ghost>Нет</a-button>
                  <a-button type="primary" danger ghost @click="deleteLesson(), closeModal()">Да</a-button>
                </a-space>
                <template #footer>

                </template>
              </a-modal>
          </div>
          <div class="quiz">
            <a-space wrap v-if="isCourseCreator">
              <a-button type="primary" class="add-new-test-btn" @click="navigateToNewTest(this.$route.params.id)">Создать тест</a-button>
            </a-space>
            <div class="quiz-block" v-for="test in tests" :key="test.id">
              <a class="testing" @click="navigateToQuiz(test.id)">{{test.title}}</a>
              <a-space warp>
                <a-button danger class="del-test-btn" @click ="showTestModal(test.id)" v-if="isCourseCreator">Удалить</a-button>
              </a-space>
              <a-modal v-model:open="open" title="Подтвердите удаление">
                <a-space class="modal-btns">
                  <a-button type="primary" @click="closeModal" ghost>Нет</a-button>
                  <a-button type="primary" danger ghost @click="deleteTest(), closeModal()">Да</a-button>
                </a-space>
                <template #footer>

                </template>
              </a-modal>
            </div>
          </div>
        </div>
      </div>
      <div class="description">
        <h3>Описание курса</h3>
        <p>{{course.body}}</p>
      </div>
      <div class="requirements">
        <h2>Требования</h2>
        <p>Современный компьютер с доступом к Интернет</p>
      </div>
      <div class="for-course-students">
        <h2>Для кого этот курс</h2>
        <div>
          <p>Новички, которые никогда не пробовали программировать</p>
          <p>Программисты, которые хотят вникнуть в новый для себя язык программирования</p>
        </div>
        <div class="course-rating">
          <h2>Оцените курс</h2>

          <div class="rating">
            <star-rating
                v-model="rating"
                :star-size="30"
                :read-only="false"
                @update:rating ="submitRating"
            />
          </div>
        </div>
      </div>
      <CoursePageSidebar v-if="!isCourseCreator && !isCoursePurchased" :course="course"/>
    </div>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";
import {message} from "ant-design-vue";
import CoursePageSidebar from "@/components/CoursePageSidebar.vue";
import StarRating from 'vue-star-rating';
import {useUserStore} from "@/store/userStore";
import {useCoursesStore} from "@/store/courseStore";
import router from "@/routes/router";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import { useRoute } from 'vue-router';
export default {
  components:{
    CoursePageSidebar, StarRating, NotFoundPage
  },
  data(){
    return{
      course: [],
      lessons: [],
      tests: [],
      userStore: useUserStore(),
      courseStore: useCoursesStore(),
      rating: 0,
      showSpinner: false,
      open: false,
      deleteLessonId: null,
      deleteTestId: null,
      courseNotFound: false,
      route: useRoute(),
    }
  },
  methods:{
    showModal(lessonId){
      this.open = true;
      this.deleteLessonId = lessonId;
    },
    showTestModal(testId){
      this.open = true;
      this.deleteTestId = testId;
    },
    closeModal(){
      this.open = false;
    },
    async getCourse(courseId){
      try {
        this.showSpinner = true;

        const courseResponse = await instance.get(`/courses/${courseId}`);
        this.course = courseResponse.data.data;

        const courseLessonResponse = await instance.get(`/courses/${courseId}/lessons`);
        this.lessons = courseLessonResponse.data.data;

        const courseTestResponse = await instance.get(`/courses/${courseId}/tests`);
        this.tests = courseTestResponse.data.data;
      }catch (error) {
        if (error.response && error.response.status === 404) {
          this.courseNotFound = true;
        } else {
          console.error('Error fetching post data', error);
        }
      }finally {
        this.showSpinner = false;
      }
    },
    async submitRating(value){
      if(!this.isCourseCreator && !this.isCoursePurchased){
        message.error('Купите курс, для того, что бы оценивать!');
        return
      }

      this.rating = value;
      const courseId = this.$route.params.id;
      try {
        const response = await instance.post(`/courses/${courseId}/rate`, {
          course_rating: this.rating,
          course_id: courseId,
          user_id: this.userStore.user.id
        });

        this.course.average_rating = response.data.average_rating;

      } catch (error) {
        if (error.response.status === 422) {
          message.error('Вы уже оценили этот курс');
        } else {
          console.error(error);
        }
      }
    },
    async deleteLesson(){
      const lessonId = this.deleteLessonId;
      const deleteLessonResponse = await instance.delete(`lessons/${lessonId}`);
      if (deleteLessonResponse.status === 200){
        this.removeLesson(lessonId);
        message.success('Урок успешно удален');
      }else{
        message.error('Ошибка при удалении урока');
      }
    },
    removeLesson(lessonId) {
      const index = this.lessons.findIndex(lesson => lesson.id === lessonId);
      if (index !== -1) {
        this.lessons.splice(index, 1);
      }
    },
    async deleteTest(){
      const testId = this.deleteTestId;
      const deleteTestResponse = await instance.delete(`tests/${testId}`);
      if (deleteTestResponse.status === 200){
        this.removeTest(testId);
        message.success('Тест успешно удален');
      }else{
        message.error('Ошибка при удалении теста');
      }
    },
    removeTest(testId) {
      const index = this.tests.findIndex(test => test.id === testId);
      if (index !== -1) {
        this.tests.splice(index, 1);
      }
    },
    markLessonCompleted(lessonId) {
      const lesson = this.lessons.find(lesson => lesson.id === lessonId);
      if (lesson) {
        lesson.completed = 1;
      }
    },
    navigateToNewLesson(courseId){
      return router.push(`/new-lesson/${courseId}`);
    },
    navigateToNewTest(testId){
      return router.push(`/new-test/${testId}`);
    },
    navigateToQuiz(testId){
      return router.push(`/quiz/${testId}`);
    },
    navigateToLesson(lessonId){
      if(this.userStore.user){
        if (this.isCourseCreator || this.isCoursePurchased) {
          return router.push(`/lessons/${lessonId}`);
        } else {
          message.error('Для доступа к уроку, купите курс!');
        }
      }else{
        return router.push('/registration');
      }
    }
  },
  computed:{
    isCourseCreator() {
      return this.userStore.user && this.course.author_id === this.userStore.user.id;
    },
    isCoursePurchased() {
      const courseId = this.$route.params.id;

      return this.courseStore.studentCourses.some(course => course.id === parseFloat(courseId));
    },
  },
  mounted() {
    this.getCourse(this.$route.params.id);
  }
}
</script>

<style scoped>
.del-test-btn{
  margin-left: 30px;
}
.course-structure{
  margin: 20px 0 0 50px;
}
.lesson-title{
  margin-right: 50px;
  color: grey;
  cursor: pointer;
}
.lesson-title:hover{
  color: #364d79;
}

.course-page{
  font-family: "Rubik", sans-serif;
  width: 100%;
}
.course-page h1{
  font-size: 35px;
  margin: 30px 0 0 50px;
}
.course-page span{
  margin: 20px 0 0 50px;
}
.course-page p{
  margin: 10px 0 0 50px;
  color: grey;
}
.why-this-course{
  box-sizing: border-box;
  border: 1px solid grey;
  width: 610px;
  padding: 20px 0 0 10px;
  margin: 40px 0 0 50px;
}
.why-this-course-info-programming{
  list-style-type: none;
  margin-left: -37px;
}
.why-this-course-info-programming li{
  display: flex;
  margin-top: 10px;
}
.why-this-course-info-programming img{
  width: 20px;
  height: 20px;
}
.why-this-course-info-programming p{
  margin: 2px 0 0 15px;
}
.description h3{
  margin: 30px 0 0 50px;
  font-size: 25px;
}
.description p{
  margin: 10px 0 0 50px;
  width: 610px;
}
.requirements{
  margin: 20px 0 0 50px;
}
.requirements p{
  margin-left: 0;
}
.for-course-students{
  margin-bottom: 30px;
}
.for-course-students h2{
  margin: 20px 0 0 50px;
}
.rating{
  margin: 10px 0 0 50px;
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
.course-lessons-block{
  margin-top: 20px;
  display: flex;
}
.del-lesson{
  margin-top: -10px;
}
.add-new-test-btn{
  margin-top: 30px;
}
.quiz-block{
  margin-top: 20px;
}
.testing{
  cursor: pointer;
}
</style>