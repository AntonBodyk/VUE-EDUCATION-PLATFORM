<script>
export default {
  name: "Navbar.vue"
}
</script>

<template>
  <template>
    <div class="navbar">
      <div>
        <p>Vue-Blog</p>
      </div>
      <div class="navbar-btns">
        <span class="user-name">{{ userName }}</span>
      </div>
      <a-modal v-model:open="open" class="registration" :width="modalWidth">
        <template #footer>
          <a-button style="background: darkcyan; color: white;" class="sign-in" @click="$router.push('/sign'), removeModal()">Войти</a-button>
          <a-button class="sign-up" @click="logout(), removeModal(), $router.push('/sign');">Выход</a-button>
        </template>
      </a-modal>
    </div>
  </template>
</template>

<style scoped>

</style>