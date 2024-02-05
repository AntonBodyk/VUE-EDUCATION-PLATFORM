<template>
  <div>
    <h1 class="new-course-title">Новый урок</h1>
    <a-form
        :model="newLessonState"
        name="basic"
        ref="formRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        style="width: 600px; margin: 50px 0 0 25%;"
        @submit.prevent="addLesson"
    >
      <a-form-item
          label="Название"
          name="title"
          :rules="[
              { required: true, message: 'Пожалуйста, введите данные!' },

            ]"
      >
        <a-input v-model:value="newLessonState.title" />
      </a-form-item>
      <a-form-item
          label="Видео"
          name="lesson_video"
          :rules="[
              {
                  validator: validateLessonVideo,
              },
           ]">

        <a-upload
            :before-upload="beforeUploadVideo"
            :show-upload-list="false"
        >
          <a-button :class="{ 'has-error': hasError }">
            <a-icon type="upload" /> {{selectedVideoName || 'Выбрать файл'}}
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
          label="Описание"
          name="description"
          :rules="[
              { required: true, message: 'Пожалуйста, введите данные!' },

            ]"
      >
        <a-textarea v-model:value="newLessonState.description" />
      </a-form-item>
      <a-form-item
          label="Задания"
          name="lesson_exercise"
          :rules="[
              {
                  validator: validateLessonExercise,
              },
           ]">

        <a-upload
            :before-upload="beforeUploadExercise"
            :show-upload-list="false"
        >
          <a-button :class="{ 'has-error': hasError }">
            <a-icon type="upload" /> {{selectedPdfName || 'Выбрать файл'}}
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button class="register-btn" type="primary" html-type="submit">Создать</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>


<script>
import {useUserStore} from "@/store/userStore";
import {instance} from "@/axios/axiosInstance";
import {message} from "ant-design-vue";
import router from "@/routes/router";

export default {
  data() {
    return {
      userStore: useUserStore(),
      hasError: false,
      selectedVideoName: null,
      selectedPdfName: null,
      newLessonState: {
        title: '',
        lesson_video: null,
        description: '',
        lesson_exercise: null,
        course_id: null,
        teacher_id: null,
      },
    };
  },
  methods: {
    async addLesson() {
      try {

        const formData = new FormData();
        formData.append('title', this.newLessonState.title);
        formData.append('lesson_video', this.newLessonState.lesson_video);
        formData.append('description', this.newLessonState.description);
        formData.append('lesson_exercise', this.newLessonState.lesson_exercise);
        formData.append('course_id', this.newLessonState.course_id);
        formData.append('teacher_id', this.newLessonState.teacher_id);

        console.log(this.newLessonState.teacher_id);
        console.log(this.newLessonState.course_id);

        const newLessonResponse = await instance.post('/lessons', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await this.$refs.formRef.validate();

        if (newLessonResponse.data && newLessonResponse.data.status !== undefined && newLessonResponse.data.status === false) {
          message.error('Ошибка при создании курса: ' + newLessonResponse.data.message);
        } else {
          this.newLessonState = {
            title: '',
            lesson_video: null,
            description: '',
            lesson_exercise: null,
          };
          message.success('Урок создан!');
          router.push('/');
        }
      } catch (error) {
        if(error.response.status === 422){
          console.log('Ошибка при создании урока')
          return;
        }
        console.error('Error during API request:', error);
        message.error('Ошибка сервера!');
      }
    },
    beforeUploadVideo(file) {
      if (file) {
        this.newLessonState.lesson_video = file;
        this.selectedVideoName = file.name;
        this.hasError = false
      }else{
        this.hasError = true;
      }
      return false;
    },
    beforeUploadExercise(file) {
      if (file) {
        this.newLessonState.lesson_exercise = file;
        this.selectedPdfName = file.name;
        this.hasError = false
      }else{
        this.hasError = true;
      }
      return false;
    },
    validateLessonVideo(rule, value) {
      if (!value) {
        return Promise.reject('Пожалуйста, добавьте видео!');
      }

      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      const fileType = value.type;

      if (!allowedTypes.includes(fileType)) {
        return Promise.reject('Допустимые типы файлов: mp4, webm, ogg');
      }

      // Дополнительные проверки на размер, длительность, разрешение и т.д.
      // Можно добавить дополнительные условия в зависимости от ваших требований.

      return Promise.resolve();
    },
    validateLessonExercise(rule, value) {
      if (!value) {
        return Promise.reject('Пожалуйста, добавьте задания в формате PDF!');
      }

      const allowedTypes = ['application/pdf'];
      const fileType = value.type;

      if (!allowedTypes.includes(fileType)) {
        return Promise.reject('Допустимые типы файлов: PDF');
      }

      // Дополнительные проверки на размер, количество страниц и т.д.
      // Можно добавить дополнительные условия в зависимости от ваших требований.

      return Promise.resolve();
    },
  },
  mounted(){
    this.newLessonState.teacher_id = this.userStore.user ? this.userStore.user.id : null;
    this.newLessonState.course_id = this.$route.params.id;
  }
}
</script>

<style scoped>
h1{
  margin-top: 50px;
  text-align: center;
  font-size: 40px;
  color: #364d79;
}
.has-error{
  border-color: red;
}
.register-btn{
  background-color: #364d79;
  margin-bottom: 40px;
}
.register-btn:hover{
  background-color: #364d79;
}
</style>