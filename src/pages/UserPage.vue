<template>
  <div class="account-container">
    <h1 class="account-title">Обновите свои данные</h1>

    <a-form
        :model="userInfo"
        name="userProfileForm"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="width: 600px; margin: 50px auto;"
        @submit.prevent="updateUserInfo"
    >
      <a-form-item label="Фото">
        <a-upload
            :before-upload="beforeUpload"
            :show-upload-list="false"
        >
          <a-avatar :src="userInfo.avatar" size="large" class="avatar" />
        </a-upload>
      </a-form-item>

      <a-form-item label="Фамилия" name="second_name">
        <a-input v-model:value="userInfo.second_name" />
      </a-form-item>
      <a-form-item label="Имя" name="first_name">
        <a-input v-model:value="userInfo.first_name" />
      </a-form-item>
      <a-form-item label="Отчество" name="last_name">
        <a-input v-model:value="userInfo.last_name" />
      </a-form-item>

      <a-form-item label="Статус" name="role_id">
        <a-select v-model:value="userInfo.role_id">
          <a-select-option v-for="role in filteredRoles()" :key="role.id" :value="role.id">{{ newRoleName(role.role_name) }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit" @click="updateUserInfo">Сохранить изменения</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";
import {useUserStore} from "@/store/userStore";

export default {
  data() {
    return {
      roles: [],
      // userProfile: {
      //   avatar: '',
      //   first_name: '',
      //   second_name: '',
      //   last_name: '',
      //   role_id: '',
      // },
    };
  },
  methods: {

    beforeUpload(file) {
      console.log('Загрузка фото:', file);
      this.userInfo.avatar = URL.createObjectURL(file);
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
    async updateUserInfo(){
        try{
          const userStore = useUserStore();
          await userStore.updateUserProfile(this.userInfo);

        }catch (e) {

        }
    }
  },
  computed:{
    userInfo(){
      const userInfo = useUserStore();
      return userInfo.user;
    }
  },
  mounted() {
    this.getUserRoles();
  }
};
</script>

<style scoped>
.account-container {
  margin-top: 20px;
  text-align: center;
  background-color: #f5f5f5; /* Цвет фона */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.account-title {
  font-family: "Kanit", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 28px;
  margin-bottom: 20px;
  color: #333; /* Цвет заголовка */
}

.avatar-upload {
  margin-bottom: 20px;
}

.avatar {
  width: 200px;
  height: 200px;
}

.success-icon {
  color: #52c41a;
  font-size: 16px;
  cursor: pointer;
}

.edit-icon {
  color: #1890ff;
  font-size: 16px;
  cursor: pointer;
}
</style>