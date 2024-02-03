<template>
  <div class="navbar">
      <div class="navbar-items">
          <h1>SmartLearn</h1>
      </div>
    <div class="navbar-categories">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click.prevent>
          Категории
        </a>
        <template #overlay>
          <a-menu class="drop-category">
            <a-menu-item v-for="category in categories" :key="category.id" class="category-name">
              <a href="#" @click="navigateToCategoriesPage(category.id)">{{category.category_name}}</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
      <a-space direction="vertical">
        <a-input-search
            name="searchQuery"
            class="search-courses"
            v-model:value="searchValue"
            placeholder="Поиск курсов"
            enter-button
            @search="onSearch"
        />
      </a-space>


    <div class="navbar-btns">
      <div class="teacher-courses" v-if="userRoleId === 2">
        <ShoppingCartOutlined class="shop-cart-teacher" @click="navigateToCartPage"/>
        <router-link to="/new-course" class="create-course-link">Создать курс</router-link>
        <a class="teacher-courses-link" @click="navigateToMyCoursesPage()">Мои курсы</a>
      </div>
      <div class="student-courses" v-if="userRoleId === 3">
        <a class="student-courses-link" href="#">Моё обучение</a>
      </div>
      <div class="user-initials" v-if="userAuth">
        <div class="user-icons">
          <img v-if="userAvatar && userAvatar.length > 0" :src="userAvatar" @click="navigateToUserPage()" class="user-photo" alt="User Avatar" @mouseover="showUserInfo" />
          <div v-else class="user-avatar" @mouseover="showUserInfo" @click="navigateToUserPage()" >{{ userAvatar && userAvatar.length > 0 ? '' : userInitials }} </div>
        </div>

        <a-space wrap>
          <div class="user-info-block" :style="{ display: showInfoBlock ? 'block' : 'none' }" @mouseover="keepUserInfoVisible" @mouseleave="closeUserInfo">
            <div class="user-info">
              <img v-if="userAvatar && userAvatar.length > 0" :src="userAvatar" class="user-photo" alt="User Avatar" />
              <div v-else class="user-info-avatar">{{ userInitials && userAvatar.length > 0 ? '' : userInitials}}</div>
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
        <ShoppingCartOutlined class="shop-cart" @click="navigateToCartPage"/>

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
import {useCoursesStore} from "@/store/courseStore";
import router from "@/routes/router";
import { ShoppingCartOutlined } from '@ant-design/icons-vue';

export default {
  components:{
    ShoppingCartOutlined
  },
  data(){
    return{
      showInfoBlock: false,
      categories: [],
      searchValue: '',
      userStore: useUserStore(),
      courseStore: useCoursesStore()
    }
  },
  methods:{
      async onSearch(){
        console.log("Search Query:", this.searchValue);
        this.courseStore.searchQuery = this.searchValue.trim();
        try {
          await this.courseStore.searchCourses(this.courseStore.searchQuery);
        } catch (e) {
          console.error('Ошибка при выполнении поиска:', e);
        }
      },
      showUserInfo(){
        this.showInfoBlock = true;
      },
      closeUserInfo() {
        this.showInfoBlock = false;
      },
      keepUserInfoVisible() {
        this.showInfoBlock = true;
      },
      navigateToUserPage(){
        if (localStorage.getItem('auth_user') && localStorage.getItem('auth_token') !== null) {
          const userId = this.userStore.user ? this.userStore.user.id : null;
          router.push(`/users/${userId}`);
        }
      },
      navigateToMyCoursesPage(){
        if (localStorage.getItem('auth_user') && localStorage.getItem('auth_token') !== null) {
          const userId = this.userStore.user ? this.userStore.user.id : null;
          router.push(`/users/${userId}/courses`);
        }
      },
      async navigateToCategoriesPage(categoryId){
        const response = await instance.get(`/categories/${categoryId}/courses`);
        this.categoryCourse = response.data.data;
        console.log(this.categoryCourse);
        router.push(`/categories/${categoryId}`);
      },
      navigateToCartPage(){
          router.push('/cart');
      },
      async logoutUser(){
        const accessToken = localStorage.getItem('auth_token');
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
          const logoutResponse = await instance.get('/logout', config);

          if(logoutResponse.status === 200){

            this.userStore.clearToken();
            this.userStore.clearAuthUser();

            message.success('Вы вышли с аккаунта');
            router.push('/');
          }else{
            message.error('Ошибка', logoutResponse);
          }

        }catch (error){
            message.error('Ошибка сервера', error);
        }
      },
    async getCourseCaregories(){
        const categoriesResponse = await instance.get('/categories');
        this.categories = categoriesResponse.data.categories;
    }
  },
  mounted() {
    this.getCourseCaregories();
  },
  computed:{
    userName(){
      return this.userStore.user ? this.userStore.user.first_name : null;
    },
    userSecondName(){
      return this.userStore.user ? this.userStore.user.second_name : null;
    },
    userLastName(){
      return this.userStore.user ? this.userStore.user.last_name : null;
    },
    combinedName(){
      return this.userName + ' ' + this.userLastName;
    },
    userEmail(){
      return this.userStore.user ? this.userStore.user.email : null;
    },
    userRoleId(){
      return this.userStore.user ? this.userStore.user.role_id : null;
    },
    userAvatar(){
      return this.userStore.user ? this.userStore.user.avatar : null;
    },
    userAuth(){
      return this.userStore.token !== null;
    },
    userInitials() {
      const userName = this.userStore.user ? this.userStore.user.first_name : null;
      const lastName = this.userStore.user ? this.userStore.user.last_name : null;

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
.shop-cart{
  font-size: 24px;
  color: white;
  margin: 7px 0 0 280px;
  cursor: pointer;
  z-index: 2;
}
.shop-cart-teacher{
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: white;
  margin: 7px 0 0 -40px;
  cursor: pointer;
}
.drop-category{
  margin-top: 20px;
}
.navbar{
    height: 50px;
    background-color: #364d79;
    box-shadow: 2px 2px 4px grey;
    display: flex;
}
.navbar h1{
  font-family: 'Lemon', serif;
  font-size: 40px;
  color: aliceblue;
  padding-left: 50px;
}
.navbar-categories{
  font-family: "Rubik", sans-serif;
  color: white;
  width: 80px;
  margin: 17px 0 0 40px;
  cursor: pointer;
}
.navbar-btns{
  margin-left: 0;
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
  margin: 4px 0 0 20px;
}
.sign-btn:hover{
  color: white;
  border-color: white;
}
.user-initials{
  width: 40px;
  height: 40px;
}
.user-initials .user-photo {
  display: inline-block;
  margin: 3px 0 0 450px;
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
  z-index: 3;
}
.user-photo{
  width: 40px;
  height: 40px;
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
  color: #364d79;
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
.teacher-courses{
  margin: 0 0 0 150px;
}
.teacher-courses-link{
  font-family: "Rubik", sans-serif;
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin: -5px 0 0 -10px;
}
.teacher-courses-link:hover{
  color: white;
}
.student-courses{
  margin: 14px 0 0 230px;
}
.student-courses-link{
  font-family: "Rubik", sans-serif;
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin: 0 0 -3px 30px;
}
.student-courses-link:hover{
  color: white;
}
.user-icons{
  margin-top: -33px;
}
.create-course-link{
  font-family: "Rubik", sans-serif;
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin: 0 40px 0 40px;
}
.category-name:hover{
  color: aqua;
}
.search-courses{
  width: 350px;
  height: 30px;
  margin: 10px 0 0 100px;
  font-family: "Rubik", sans-serif;
}
</style>