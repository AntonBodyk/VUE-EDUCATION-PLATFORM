<template>
  <div class="course-page" v-if="course.id">
    <h1 class="course-title">{{course.title}}</h1>
    <p v-if="course.author" class="course-author">Автор: {{ course.author.second_name }} {{ course.author.first_name }} {{ course.author.last_name }}</p>

    <div class="why-this-course">
      <h2>Чему вы научитесь</h2>
      <ul class="why-this-course-info-programming">
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Писать простые программы на Python 3</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Логика с условиями и циклами</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Объектно-ориентированное программирование на Python</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Неизменяемые объекты</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Введение в SQL и PostgreSQL</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Декораторы</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Использование Jupyter Notebook</p>
        </li>
        <li>
          <img src="../../public/images/course-page-images/check1.png" alt="упс...">
          <p>Логика с условиями и циклами</p>
        </li>
      </ul>

    </div>
    <div class="course-structure">
      <h2>Материалы курса</h2>
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
    <CoursePageSidebar v-if="!isCourseCreator"/>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";
import {message} from "ant-design-vue";
import CoursePageSidebar from "@/components/CoursePageSidebar.vue";
import StarRating from 'vue-star-rating';
import {useUserStore} from "@/store/userStore";
export default {
  components:{
    CoursePageSidebar, StarRating
  },
  data(){
    return{
      course: [],
      userStore: useUserStore(),
      rating: 0
    }
  },
  methods:{
    async getCourse(courseId){
      const courseResponse = await instance.get(`/courses/${courseId}`);
      this.course = courseResponse.data.data;
    },
    async submitRating(value){
      this.rating = value;
      const courseId = this.$route.params.id;
      try {
        const response = await instance.post(`/courses/${courseId}/rate`, {
          course_rating: this.rating,
          course_id: courseId,
          user_id: this.userStore.user.id
        });

        // Обновление среднего рейтинга
        this.course.average_rating = response.data.average_rating;

      } catch (error) {
        if (error.response.status === 422) {
          message.error('Вы уже оценили этот курс');
        } else {
          console.error(error);
        }
      }
    }
  },
  computed:{
    isCourseCreator() {
      if(this.userStore.user){
        return this.course.author_id === this.userStore.user.id;
      }
    }
  },
  mounted() {
    this.getCourse(this.$route.params.id);
  }
}
</script>
<style scoped>
.course-structure{
  margin: 20px 0 0 50px;
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
</style>