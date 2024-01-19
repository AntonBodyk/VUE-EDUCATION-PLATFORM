<template>
  <div class="navbar">
      <div>
          <h1>SmartLearn</h1>
      </div>
    <div class="navbar-btns">
      <div class="user-initials" v-if="userAuth">
        <div @mouseover="showUserInfo" @click="navigateToUserPage()">
          <img v-if="userAvatar" :src="userAvatar" class="user-photo" alt="User Avatar" />
          <div v-else class="user-avatar">{{ userInitials }}</div>
        </div>

        <a-space wrap>
          <div class="user-info-block" v-if="showInfoBlock" @mouseover="keepUserInfoVisible">
            <div class="user-info">
              <img v-if="userAvatar" :src="userAvatar" class="user-photo" alt="User Avatar" />
              <div v-else class="user-info-avatar">{{ userInitials }}</div>
            </div>
            <div class="user-details">
              <p @click="navigateToUserPage()" class="user-name">{{ userSecondName + ' ' + userName + ' ' + userLastName }}</p>
              <p class="user-email">{{ userEmail }}</p>
              <a-button class="exit-button" @click="logoutUser()">Выход</a-button>
            </div>
          </div>
        </a-space>
      </div>

      <a-space wrap v-else>
        <a-button ghost class="sign-btn" @click="$router.push('/sign')">Войти</a-button>
        <a-button type="primary" class="registration-btn" @click="$router.push('/registration')">Регистрация</a-button>
      </a-space>
    </div>
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
      showInfoBlock: false
    }
  },
  methods:{
      showUserInfo(){
        this.showInfoBlock = true;
      },
      closeUserInfo() {
        this.showInfoBlock = false;
      },
      keepUserInfoVisible() {},
      navigateToUserPage(){
        if (localStorage.getItem('auth_user') && localStorage.getItem('auth_token') !== null) {
          const userStore = useUserStore();
          const userId = userStore.user ? userStore.user.id : null;
          router.push(`/${userId}`);
        }
      },
      async logoutUser(){
        const userStore = useUserStore();
        const accessToken = localStorage.getItem('auth_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
          const logoutResponse = await instance.get('/logout', config);

          if(logoutResponse.status === 200){

            userStore.clearToken();
            userStore.clearAuthUser();

            message.success('Вы вышли с аккаунта');
            router.push('/');
          }else{
            message.error('Ошибка', logoutResponse);
          }

        }catch (error){
            message.error('Ошибка сервера', error);
        }
      }
  },
  computed:{
    userName(){
      const userStore = useUserStore();
      return userStore.user ? userStore.user.first_name : null;
    },
    userSecondName(){
      const userStore = useUserStore();
      return userStore.user ? userStore.user.second_name : null;
    },
    userLastName(){
      const userStore = useUserStore();
      return userStore.user ? userStore.user.last_name : null;
    },
    combinedName(){
      return this.userName + ' ' + this.userLastName;
    },
    userEmail(){
      const userStore = useUserStore();
      return userStore.user ? userStore.user.email : null;
    },
    userAvatar(){
      const userStore = useUserStore();
      return userStore.user ? userStore.user.avatar : null;
    },
    userAuth(){
      const auth = useUserStore();
      return auth.token !== null;
    },
    userInitials() {
      const userStore = useUserStore();
      const userName = userStore.user ? userStore.user.first_name : null;
      const lastName = userStore.user ? userStore.user.last_name : null;

      const combinedName = userName + ' ' + lastName;

      if(combinedName){
        const initials = this.combinedName
            .split(" ")
            .map((word) => word[0])
            .join("");
        return initials.slice(0, 2).toUpperCase();
      }else{
        return null;
      }
    },
  }
}
</script>


<style scoped>
.navbar{
    height: 50px;
    background-color: darkslategray;
    box-shadow: 2px 2px 4px grey;
    display: flex;
}
.navbar h1{
  font-family: 'Lemon', serif;
  font-size: 40px;
  color: aliceblue;
  padding-left: 50px;
}
.navbar-btns{
  margin-left: 40%;
}
.registration-btn{
  background-color: black;
  height: 40px;
  margin: 4px 0 0 10px;
}
.registration-btn:hover{
  background-color: black;
}
.sign-btn{
  height: 40px;
  margin: 4px 0 0 300px;
}
.sign-btn:hover{
  color: white;
  border-color: white;
}
.user-initials .user-photo {
  display: inline-block;
  margin: 5px 0 0 450px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background-color: black;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}
.user-avatar {
  width: 40px;
  height: 40px;
  margin: 5px 0 0 450px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background-color: black;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}
.user-info-block {
  display: none;
  position: absolute;
  width: 300px;
  max-height: 150px;
  margin-left: 350px;
  top: 50px;
  left: 50%;
  background-color: #fff;
  border: 1px solid grey;
  padding: 5px;
  overflow: hidden;
}

.user-info-avatar {
  width: 40px;
  height: 40px;
  margin: 20px 0 0 10px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background-color: black;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}
.user-details{
  font-size: 12px;
  margin: -38px 0 0 70px;
}
.user-name{
  color: black;
  cursor: pointer;
}
.user-name:hover{
  color: cadetblue;
}

.user-initials:hover .user-info-block {
  display: block;
}

.exit-button{
  color: white;
  background-color: black;
  margin-bottom: 10px;
}
.exit-button:hover{
  color: white;
  background-color: black;
  border-color: black;
}
.user-info .user-photo{
  margin: 8px 0 0 10px;
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  background-color: black;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}

</style>