<template>
  <div class="navbar">
      <div>
          <p>SmartLearn</p>
      </div>
            <div class="navbar-btns">
              <span class="user-name">{{ userName }}</span>
              <UserOutlined class="user" @click="showModal"/>
            </div>
            <a-modal v-model:open="open" class="registration" :width="modalWidth">
              <template #footer>
                <a-button style="background: darkcyan; color: white;" class="sign-in" @click="$router.push('/sign'), closeModal()">Войти</a-button>
                <a-button class="sign-up" @click="logoutUser(), closeModal(), $router.push('/sign');">Выход</a-button>
              </template>
            </a-modal>
    </div>
</template>





<script>
import {instance} from "@/axios/axiosInstance";
import {UserOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";
import {useUserStore} from "@/store/userStore";
import router from "@/routes/router";

export default {
  components:{
    UserOutlined
  },
  data(){
    return{
      open: false,
      modalWidth: "250px"
    }
  },
  methods:{
      showModal(){
        this.open = true;
      },
      closeModal(){
        this.open = false;
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
    }
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
.navbar p{
  font-family: 'Lemon', serif;
  font-size: 40px;
  color: aliceblue;
  padding-left: 50px;
}
.navbar-btns{
  margin-left: 40%;
}
.user{
  font-size: 20px;
  color: white;
  cursor: pointer;
  padding: 5px 0 0 80px;
}

.user-name{
  color: #fff;
}
</style>