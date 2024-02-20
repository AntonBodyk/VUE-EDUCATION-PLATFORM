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
              <a href="#" @click="navigateToCategoriesPage(category, categoryId)">{{category.category_name}}</a>
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
        <span class="cart-teacher-count" v-if="cartStore.cartCourses.length > 0">{{cartItemCount}}</span>
        <div class="teacher-link-container">
          <router-link to="/new-course" class="create-course-link">Создать курс</router-link>
          <a class="teacher-courses-link" @click="navigateToMyCoursesPage()">Мои курсы</a>
          <a class="teacher-courses-link-report" @click="generateReport()">Отчет</a>
        </div>
      </div>
      <div class="student-courses" v-if="userRoleId === 3">
        <ShoppingCartOutlined class="shop-cart-student" @click="navigateToCartPage"/>
        <span class="cart-student-count"  v-if="cartStore.cartCourses.length > 0">{{cartItemCount}}</span>
        <div class="student-courses-link-container">
          <a class="student-courses-link" @click="navigateToMyLearningPage">Моё обучение</a>
        </div>

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
        <span class="cart-count"  v-if="cartStore.cartCourses.length > 0">{{cartItemCount}}</span>
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
import {useCartStore} from "@/store/cartStore";
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
      courseStore: useCoursesStore(),
      cartStore: useCartStore()
    }
  },
  methods:{
      async onSearch(){
        this.courseStore.searchQuery = this.searchValue.trim();
        try {
          const userId = this.userStore.user ? this.userStore.user.id : null;
          const categoryId = this.$route.params.id;
          await this.courseStore.searchCourses(this.courseStore.searchQuery);
          await this.courseStore.searchCoursesCategory(this.courseStore.searchQuery, categoryId);
          await this.courseStore.searchCoursesForUser(this.courseStore.searchQuery, userId);
        } catch (e) {
          console.error('Ошибка при выполнении поиска:', e);
        }
      },
      async generateReport() {
        const accessToken = localStorage.getItem('auth_token');
        try {
          const response = await instance.get('/generate-report', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
          console.log(response.data);

        } catch (error) {
          console.error('Ошибка при выполнении запроса на генерацию отчета:', error);
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
      navigateToMyLearningPage(){
        if (localStorage.getItem('auth_user') && localStorage.getItem('auth_token') !== null) {
          const userId = this.userStore.user ? this.userStore.user.id : null;
          router.push(`/users/${userId}/learning`);
        }
      },
    async navigateToCategoriesPage(category){
      try {
        const response = await instance.get(`/categories/${category.id}/courses`);
        this.courseStore.courseCategoryName = category.category_name;
        router.push(`/categories/${category.id}`);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          router.push({ name: 'NotFoundPage' });
        } else {
          console.error('Ошибка при загрузке курсов категории:', error);
        }
      }
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
    cartItemCount(){
      return this.cartStore.cartCourses.length;
    },
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
.teacher-link-container{
  position: absolute;
  top: 17px;
  height: 24px;
  margin-left: -50px;
}
.student-courses-link-container {
  position: absolute;
  top: 17px;
  right: 200px;
  height: 24px;
}
.cart-count {
  margin: -5px 0 0 -17px;
  background-color: blue;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}
.cart-teacher-count{
  position: absolute;
  margin: -30px 0 0 -45px;
  background-color: blue;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cart-student-count{
  position: absolute;
  margin: -30px 0 0 -25px;
  background-color: blue;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
  margin: 14px 0 0 -60px;
  cursor: pointer;
}

.shop-cart-student{
  font-size: 24px;
  width: 24px;
  height: 24px;
  color: white;
  margin: 11px 0 0 -40px;
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
  position: relative;
}
.user-initials .user-photo {
  display: inline-block;
  margin: 0 0 0 450px;
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
  margin-left: 180px;
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
.teacher-courses-link-report{
  font-family: "Rubik", sans-serif;
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin: -5px 0 0 20px;
}
.teacher-courses-link-report:hover{
  color: white;
}
.student-courses{
  margin: 3px 0 0 230px;
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