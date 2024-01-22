<template>
  <div class="account-container">
    <h1 class="account-title">Обновите свои данные</h1>

    <a-form
        :model="userInfo"
        name="userProfileForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="width: 600px; margin: 50px auto;"
        @submit.prevent="updateUserProfile"
        class="form-update"
    >
      <a-form-item label="Фото" name="avatar">
        <a-upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
            class="custom-upload"
        >
          <a-avatar v-if="userInfo && userInfo.avatar" :src="userInfo.avatar" size="large" class="avatar"></a-avatar>
        </a-upload>
      </a-form-item>

      <a-form-item label="Фамилия" name="second_name">
        <a-input class="second-name" v-if="userInfo && userInfo.second_name !== null" v-model:value="userInfo.second_name" />
      </a-form-item>
      <a-form-item label="Имя" name="first_name">
        <a-input class="first-name" v-if="userInfo && userInfo.first_name !== null" v-model:value="userInfo.first_name" />
      </a-form-item>
      <a-form-item label="Отчество" name="last_name">
        <a-input class="last-name" v-if="userInfo && userInfo.last_name !== null" v-model:value="userInfo.last_name" />
      </a-form-item>
      <a-form-item label="Эл. почта" name="email">
        <a-input class="last-name" v-if="userInfo && userInfo.email !== null" v-model:value="userInfo.email" />
      </a-form-item>
      <a-form-item label="Статус" name="role_id">
        <a-select class="user-select-name" v-if="userInfo && userInfo.role_id" v-model:value="userInfo.role_id">
          <a-select-option  v-for="role in filteredRoles()" :key="role.id" :value="role.id">{{ newRoleName(role.role_name) }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" class="update-btn" html-type="submit" @click="updateUserProfile">Сохранить изменения</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";
import {useUserStore} from "@/store/userStore";
import {message} from "ant-design-vue";

export default {
  data() {
    return {
      roles: [],
      file: null
    };
  },
  methods: {
    beforeUpload(file) {
      console.log('Загрузка фото:', file);
      this.userInfo.avatar = file
      return false;
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
    filteredRoles(){
      return this.roles.filter(role => role.id !== 1);
    },
    newRoleName(roleName){
      switch (roleName){
        case 'teacher':
          return 'Учитель';
        case 'student':
          return 'Ученик';
        default:
          return roleName;
      }
    },
    async updateUserProfile() {
      const userStore = useUserStore();

      try {
        const formData = new FormData();
        formData.append('id', userStore.user.id);

        // Вместо добавления this.file добавляем весь файл
        if (this.userInfo.avatar) {
          formData.append('avatar', this.userInfo.avatar);
        }

        formData.append('second_name', this.userInfo.second_name || '');
        formData.append('first_name', this.userInfo.first_name || '');
        formData.append('last_name', this.userInfo.last_name || '');
        formData.append('email', this.userInfo.email || '');
        formData.append('role_id', this.userInfo.role_id || '');

        // Отправляем запрос на сервер
        const response = await instance.patch(`/users/${userStore.user.id}`, formData);

        // Проверяем формат ответа
        console.log('Server Response:', response.data);

        // Обновляем локальные данные пользователя на фронтенде только после успешного ответа от сервера
        if (response.data.user) {
          userStore.setUser(response.data.user);
          console.log('Updated Locally:', userStore.user);
        }

        message.success('Профиль обновлен!');
      } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
      }
    },
  },
  computed:{
    userInfo(){
      const userInfo = useUserStore();
      return userInfo.user;
    },
  },
  mounted() {
    this.getUserRoles();
  }
};
</script>

<style scoped>
.account-container {
  text-align: center;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height: 700px;
  margin-left: -30px;
}
.second-name{
  padding-left: 150px;
  font-family: "Rubik", sans-serif;
}
.first-name{
  padding-left: 150px;
  font-family: "Rubik", sans-serif;
}
.last-name{
  padding-left: 150px;
  font-family: "Rubik", sans-serif;
}
.user-select-name{
  font-family: "Rubik", sans-serif !important;
}
.form-update{
  padding-right: 50px ;
}
.account-title {
  font-family: "Rubik", sans-serif;
  font-size: 40px;
  margin: 0 0 20px 70px;
  color: #333;
}

.avatar {
  width: 200px;
  height: 200px;
  cursor: pointer;
}

.update-btn{
  background-color: cadetblue;
}
.update-btn:hover{
  background-color: cadetblue;
}
</style>