<template>
  <template>
    <div class="navbar">
      <div>
          <p>Vue-Blog</p>
      </div>
      <!--      <div class="navbar-btns">-->
      <!--        <span class="user-name">{{ userName }}</span>-->
      <!--      </div>-->
      <!--      <a-modal v-model:open="open" class="registration" :width="modalWidth">-->
      <!--        <template #footer>-->
      <!--          <a-button style="background: darkcyan; color: white;" class="sign-in" @click="$router.push('/sign'), removeModal()">Войти</a-button>-->
      <!--          <a-button class="sign-up" @click="logout(), removeModal(), $router.push('/sign');">Выход</a-button>-->
      <!--        </template>-->
      <!--      </a-modal>-->
    </div>
  </template>
</template>





<script>
export default {
  name: "Navbar.vue"
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
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 40px;
  color: aliceblue;
  padding-left: 100px;
}
</style>