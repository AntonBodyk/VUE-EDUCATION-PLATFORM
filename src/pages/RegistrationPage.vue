<template>
  <div>
    <h1 class="registration">Регистрация пользователя</h1>
    <a-form
        :model="registrationState"
        name="basic"
        ref="formRef"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        style="width: 600px; margin: 100px 0 0 25%;"
        @submit.prevent="registrationUser"
    >
      <a-form-item
          label="Фото"
          name="avatar"
          :rules="[
              {
                  validator: validateAvatar,
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
          label="ФИО"
          name="name"
          :rules="[
              { required: true, message: 'Пожалуйста, введите данные!' },
              {
                  validator: validateName,
              },
            ]"
      >
        <a-input v-model:value="registrationState.name" />
      </a-form-item>

      <a-form-item name="email" label="Email" :rules="[
            { required: true, message: 'Пожалуйста, введите адрес электронной почты!' },
            { type: 'email', message: 'Неверный формат электронной почты!' }
        ]">
        <a-input v-model:value="registrationState.email"  />
      </a-form-item>

      <a-form-item label="Роль"
                   name="role_id"
                   :rules="[
                       { required: true, message: 'Пожалуйста, добавьте роль!' },
                   ]">
        <a-select v-model:value="registrationState.role_id">
          <a-select-option v-for="role in filteredRoles()" :key="role.id" :value="role.id">{{ renameRole(role.role_name) }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
          label="Пароль"
          name="password"
          :rules="[
              { required: true, message: 'Пожалуйста, введите пароль!' },
              {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message: 'Пароль должен содержать хотя бы одну большую букву, одну строчную букву, одну цифру и иметь длину не менее 8 символов!',
              },
            ]"
      >
        <a-input-password v-model:value="registrationState.password" />
      </a-form-item>

      <a-form-item has-feedback
                   label="Подтвердите пароль"
                   name="checkPass"
                   :rules="[
                      { required: true, message: 'Пожалуйста, повторите пароль!' },
                      {
                          validator: validateConfirmPassword,
                      },
                   ]">
        <a-input v-model:value="registrationState.checkPass" type="password" autocomplete="off" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Зарегистрироваться</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>


<script>
import {getCurrentInstance, ref} from "vue";
import {instance} from "@/axios/axiosInstance";
import {message} from 'ant-design-vue';
import router from "@/routes/router";
  export default {
    data() {
      return {
        roles: [],
        hasError: false,
        selectedFileName: null,
        registrationState: {
          avatar: null,
          name: '',
          email: '',
          role_id: null,
          password: '',
          checkPass: '',
        },
      };
    },
    methods: {
      async registrationUser() {
        try {

          const formData = new FormData();
          formData.append('avatar', this.registrationState.avatar);
          formData.append('name', this.registrationState.name);
          formData.append('email', this.registrationState.email);
          formData.append('role_id', this.registrationState.role_id);
          formData.append('password', this.registrationState.password);


          const registrationResponse = await instance.post('/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          await this.$refs.formRef.validate();
          console.log('Validation passed, sending API request...');

          if (registrationResponse.data && registrationResponse.data.status) {
            this.registrationState = {
              avatar: null,
              name: '',
              email: '',
              role_id: null,
              password: '',
              checkPass: '',
            };
            message.success('Регистрация прошла успешно!');
            router.push('/sign');
          } else {
            message.error('Ошибка при регистрации: ' + registrationResponse.data.message);
          }
        } catch (error) {
          if(error.response.status === 422){
            console.log('Ошибка при регистрации')
            return;
          }
          console.error('Error during API request:', error);
          message.error('Ошибка сервера!');
        }
      },
      async getUserRoles() {
        try {
          const response = await instance.get('/roles');
          this.roles = response.data.roles;
          console.log('Roles:', this.roles);
        } catch (error) {
          console.error('Error getting roles:', error);
        }
      },
      beforeUpload(file) {
        if (file) {
          this.registrationState.avatar = file;
          this.selectedFileName = file.name;
          this.hasError = false
        }else{
          this.hasError = true;
        }
        return false; // Отмена автоматической загрузки файла
      },
      validateAvatar(rule, value) {
        if (!value) {
          return Promise.reject('Пожалуйста, добавьте фото!');
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const fileType = value.type;

        if (!allowedTypes.includes(fileType)) {
          return Promise.reject('Допустимые типы файлов: jpeg, jpg, png');
        }

        return Promise.resolve();
      },
      validateName(rule, value) {
        return new Promise((resolve, reject) => {
          if (value) {
            const namePattern = /^([a-zA-Zа-яёґєії]+[\s]{0,1}[a-zA-Zа-яёґєії]+[\s]{0,1}[a-zA-Zа-яёґєії]+)$/ig;

            if (namePattern.test(value)) {
              resolve();
            } else {
              reject('Имя должно начинаться с большой буквы и не содержать чисел!');
            }
          } else {
            resolve();
          }
        });
      },
      validateConfirmPassword(rule, value) {
        return new Promise((resolve, reject) => {
          if (value !== this.registrationState.password) {
            return reject('Пароли не совпадают!');
          }
          return resolve();
        });
      },
      filteredRoles(){
        return this.roles.filter(role => role.id !== 1);
      },
      renameRole(roleName){
        switch (roleName){
          case 'teacher':
            return 'Учитель';
          case 'student':
            return 'Ученик';
          default:
            return roleName;
        }
      }
    },
    mounted(){
        this.getUserRoles();
    }
  }
</script>



<style scoped>
h1{
  margin-top: 50px;
  margin-left: 34%;
  font-size: 40px;
  color: darkcyan;
}
.has-error{
  border-color: red;
}
</style>