<template>
  <div>
    <h1 class="sign">Вход в аккаунт</h1>
    <a-form
        :model="signState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        style="width: 600px; margin: 100px 0 0 25%;"
        @submit.prevent="loginUser"
    >
      <a-form-item
          label="Эл. почта"
          name="email"
          :rules="[
            { required: true, message: 'Пожалуйста, введите электронный адрес!' },
            { type: 'email', message: 'Неверный формат электронной почты!' }
          ]"
      >
        <a-input v-model:value="signState.email" />
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
        <a-input-password v-model:value="signState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="signState.remember">Запомнить меня</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Войти</a-button>
      </a-form-item>
    </a-form>
    <p class="registration">Нет аккаунта? <router-link to="/registration">Зарегистрироваться</router-link></p>
  </div>
</template>


<script>
import {instance} from "@/axios/axiosInstance";
import {message} from "ant-design-vue";
import {useUserStore} from "@/store/userStore";
import router from "@/routes/router";

export default {
  data(){
    return{
      signState: {
        email: '',
        password: '',
      },
    }
  },
  methods:{
    async loginUser(){
      try {
        const loginResponse = await instance.post('/login', {
            email: this.signState.email,
            password: this.signState.password,
        });

        if(loginResponse.data && loginResponse.data.token){
          const token = loginResponse.data.token;
          const userStore = useUserStore();

          console.log(loginResponse.data);
          userStore.setToken(token);
          userStore.setUser(loginResponse.data);

          message.success('Вход выполнен!');
          router.push('/');
          this.signState = {
            email: '',
            password: '',
          }

        }else{
          message.error('Ошибка, вход не выполнен!');
        }


      }catch (error){
        if(error.response.status === 422){
          console.log('Ошибка входа');
          return;
        }else if(error.response.status === 404){
          message.error('Пользователь не найден!');
          return;
        }
        message.error('Ошибка сервера!')
      }
    }
  }
}
</script>

<style scoped>
h1{
  margin: 50px 0 0 43%;
  font-size: 40px;
  color: darkcyan;
}
.registration{
  margin: 50px 0 0 43%;
}
.registration a{
  color: cadetblue;
  text-decoration: none;
}
</style>