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
              { required: true, message: 'Пожалуйста, добавьте фото!' },
              {
                  validator: validateAvatar,
              },
           ]">

        <a-upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
        >
          <a-button>
            <a-icon type="upload" /> Выбрать файл
          </a-button>
        </a-upload>
        <div v-if="registrationState.avatar">{{ registrationState.avatar.name }}</div>
      </a-form-item>
      <a-form-item
          label="ФИО"
          name="name"
          :rules="[
              { required: true, message: 'Пожалуйста, введите имя!' },
              {
                  validator: validateName,
              },
            ]"
      >
        <a-input v-model:value="registrationState.name" />
      </a-form-item>

      <a-form-item name="email" label="Email" :rules="[
            { required: true, message: 'Пожалуйста, введите адрес электронной почты!' },
            { type: 'email', message: 'Неверный формат электронной почты!' },
            { validator: validateEmail },
        ]">
        <a-input v-model:value="registrationState.email" @input="clearEmailValidation" />
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


          // Проводим валидацию перед отправкой запроса
          await this.$refs.formRef.validate();
          console.log('Validation passed, sending API request...');

          console.log('API request succeeded:', registration.data);
          // // Если есть ошибки валидации, просто завершаем функцию
          if (this.$refs.formRef.formModel.$pending && Object.keys(this.$refs.formRef.formModel.$pending).length > 0) {
            return;
          }

          const registrationResponse = await instance.post('/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });


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
          this.registrationState.avatarName = file.name;
          this.registrationState.avatar = file;
        }
        return false; // Отмена автоматической загрузки файла
      },
      validateAvatar(rule, value) {
        if (!value) {
          return Promise.reject('Пожалуйста, выберите файл для аватара');
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
      validateEmail(rule, value) {
        return new Promise((resolve, reject) => {
          if (value) {
            const emailPattern = /@/;

            if (emailPattern.test(value)) {
              return resolve();
            } else {
              return reject("Email address should contain the symbol '@'!");
            }
          } else {
            return resolve();
          }
        });
      },
      clearEmailValidation() {
        // Assuming some form validation method is available
        this.$refs.formRef.clearValidate('user.email');
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
            return 'Учень';
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
</style>