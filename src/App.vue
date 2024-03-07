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
  },
  mounted() {
    window.Echo.channel('reportGeneration')
        .listen('PdfGenerated', (event) => {
          if (event && event.pdfUrl) {


            const element = document.createElement('a');
            element.setAttribute('href', event.pdfUrl);
            element.setAttribute('download', 'user-report.pdf');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);

          }
        })
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