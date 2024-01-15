<template>
  <div class="navbar">
      <div>
          <h1>SmartLearn</h1>
      </div>
            <div class="navbar-btns">
              <span class="user-initials" v-if="userAuth" @mouseover="showUserInfo">
                <img :src="`${fullUrl}`" alt="User Avatar" />
              </span>
              <div class="user-info-block" v-if="showInfoBlock" @mouseover="keepUserInfoVisible">
                <div class="user-avatar">{{ userInitials }}</div>
                  <div class="user-details">
                    <p class="user-name">{{ userName }}</p>
                    <p class="user-email">{{ userEmail }}</p>
                  </div>
                <a-space wrap>
                  <a-button class="exit-button" @click="logoutUser()">Выход</a-button>
                </a-space>
              </div>

              <a-space wrap v-if="!userAuth">
                <a-button ghost class="sign-btn" @click="$router.push('/sign')">Войти</a-button>
                <a-button type="primary" class="registration-btn" @click="$router.push('/registration')">Регистрация</a-button>
              </a-space>
            </div>
    </div>
</template>





<script>
import {instance} from "@/axios/axiosInstance";
import {UserOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";
import {useUserStore} from "@/store/userStore";

export default {
  components:{
    UserOutlined
  },
  data(){
    return{
      modalWidth: "250px",
      showInfoBlock: false,
      avatarFullUrl: null
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
      return userStore.user ? userStore.user.name : null;
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
      const userName = userStore.user ? userStore.user.name : null;

      if(userName){
        const initials = this.userName
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
.user-initials {
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

.user-avatar {
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
}

.navbar-btns:hover .user-info-block {
  display: block;
}

.exit-button{
  color: white;
  background-color: black;
  margin: 0 0 10px 70px;
}
.exit-button:hover{
  color: white;
  background-color: black;
  border-color: black;
}
</style>