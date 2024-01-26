<template>
    <div class="app">
      <main>
        <Navbar/>
        <router-view></router-view>
      </main>
      <Footer/>
    </div>
</template>


<script>
import Navbar from './components/UI/Navbar.vue';
import Footer from "@/components/UI/Footer.vue";
export default {
  components:{
    Navbar, Footer
  }
}
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;

}
</style>