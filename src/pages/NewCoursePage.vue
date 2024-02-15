<template>
  <div>
    <h1 class="new-course-title">Новый курс</h1>
    <a-form
        :model="newCourseState"
        name="basic"
        ref="formRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        style="width: 600px; margin: 50px 0 0 25%;"
        @submit.prevent="addCourse"
    >
      <a-form-item
          label="Картинка"
          name="course_img"
          :rules="[
              {
                  validator: validateCourseImg,
              },
           ]">

        <a-upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
        >
          <a-button :class="{ 'has-error': hasError }">
            <a-icon type="upload" /> {{selectedFileName || 'Выбрать файл'}}
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item
          label="Название"
          name="title"
          :rules="[
              { required: true, message: 'Пожалуйста, введите данные!' },

            ]"
      >
        <a-input v-model:value="newCourseState.title" />
      </a-form-item>
      <a-form-item
          label="Описание"
          name="body"
          :rules="[
              { required: true, message: 'Пожалуйста, введите данные!' },

            ]"
      >
        <a-textarea v-model:value="newCourseState.body" />
      </a-form-item>

      <a-form-item label="Категория"
                   name="category_id"
                   :rules="[
                       { required: true, message: 'Пожалуйста, добавьте роль!' },
                   ]">
        <a-select v-model:value="newCourseState.category_id">
          <a-select-option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category_name }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
          label="Цена"
          name="course_price"
          :rules="[
              { required: true, message: 'Пожалуйста, введите данные!' },
              {
                  validator: validatePrice,
              },
            ]"
      >
        <a-input v-model:value="newCourseState.course_price" />
      </a-form-item>


      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button class="register-btn" type="primary" html-type="submit">Создать</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>


<script>
import {getCurrentInstance, ref} from "vue";
import {instance} from "@/axios/axiosInstance";
import {useUserStore} from "@/store/userStore";
import {message} from 'ant-design-vue';
import router from "@/routes/router";
export default {
  data() {
    return {
      userStore: useUserStore(),
      categories: [],
      hasError: false,
      selectedFileName: null,
      newCourseState: {
        course_img: null,
        title: '',
        body: '',
        course_price: '',
        category_id: null,
        author_id: null
      },
    };
  },
  methods: {
    async addCourse() {
      try {

        const formData = new FormData();
        formData.append('course_img', this.newCourseState.course_img);
        formData.append('title', this.newCourseState.title);
        formData.append('body', this.newCourseState.body);
        formData.append('category_id', this.newCourseState.category_id);
        formData.append('course_price', this.newCourseState.course_price);
        formData.append('author_id', this.newCourseState.author_id);

        console.log(this.newCourseState.author_id)

        const newCourseResponse = await instance.post('/courses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        await this.$refs.formRef.validate();

        if (newCourseResponse.data && newCourseResponse.data.status !== undefined && newCourseResponse.data.status === false) {
          message.error('Ошибка при создании курса: ' + newCourseResponse.data.message);
        } else {
          this.newCourseState = {
            course_img: null,
            title: '',
            body: '',
            category_id: null,
            price: '',
          };
          message.success('Курс создан!');
          router.push('/');
        }
      } catch (error) {
        if(error.response.status === 422){
          console.log('Ошибка при создании курса')
          return;
        }
        console.error('Error during API request:', error);
        message.error('Ошибка сервера!');
      }
    },
    async getCourseCategories() {
      try {
        const response = await instance.get('/categories');
        this.categories = response.data.categories;
        console.log('Roles:', this.categories);
      } catch (error) {
        console.error('Error getting roles:', error);
      }
    },
    beforeUpload(file) {
      if (file) {
        this.newCourseState.course_img = file;
        this.selectedFileName = file.name;
        this.hasError = false
      }else{
        this.hasError = true;
      }
      return false;
    },
    validateCourseImg(rule, value) {
      if (!value) {
        return Promise.reject('Пожалуйста, добавьте картинку!');
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const fileType = value.type;

      if (!allowedTypes.includes(fileType)) {
        return Promise.reject('Допустимые типы файлов: jpeg, jpg, png');
      }

      return Promise.resolve();
    },

    validatePrice(rule, value) {
      return new Promise((resolve, reject) => {
        if (value) {
          const isNumericString = /^\d+\.\d{2}$/.test(value);

          if (!isNumericString) {
            reject('Пожалуйста, введите десятичное число!');
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    },
  },
  mounted(){
    this.newCourseState.author_id = this.userStore.user ? this.userStore.user.id : null;
    this.getCourseCategories();
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