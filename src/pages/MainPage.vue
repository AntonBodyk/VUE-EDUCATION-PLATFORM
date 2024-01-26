<template>
  <main>
    <a-carousel class="main-carousel" autoplay>
      <div><img src="../../public/images/slider/lms5.jpg" alt="Упс..."></div>
      <div><img src="../../public/images/slider/lms2.jpg" alt="Упс..."></div>
      <div><img src="../../public/images/slider/lms9.jpg" alt="Упс..."></div>
      <div><img src="../../public/images/slider/lms4.jpg" alt="Упс..."></div>
    </a-carousel>
    <div class="main-partners-banner">
      <h2>Нам доверяют более 5 000 компаний и тысячи учащихся по всему миру</h2>
      <ul class="main-partners-list">
        <li><img src="../../public/images/partnes-images/volkswagen.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/samsung.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/cisco.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/att.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/procter_gamble.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/hewlett_packard_enterprise.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/citi.svg" alt="Упс..."></li>
        <li><img src="../../public/images/partnes-images/ericsson.svg" alt="Упс..."></li>
      </ul>
    </div>
    <div class="main-courses-container">
        <h2>Большой выбор курсов</h2>
        <p>Выбирайте из более чем 1000 онлайн-видеокурсов; новые курсы добавляются на сайт каждый месяц</p>
        <CourseList/>
    </div>
  </main>
</template>



<script>
import CourseList from "@/components/CourseList.vue";
export default {
  components:{
      CourseList
  }
}
</script>

<style scoped>
:deep(.slick-slide) {
  text-align: center;
  height: 450px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}
:deep(.slick-slide h3) {
  color: #fff;
}
.main-carousel{
  width: 100%;
}
.main-partners-banner{
  background-color: azure;
  margin-top: 40px;
  height: 150px;
  text-align: center;
}
.main-partners-banner h2{
  color: grey;
  font-family: "Rubik", sans-serif;
  padding-top: 20px;
}
.main-partners-list{
  display: flex;
  width: 1360px;
  list-style-type: none;
  margin: 20px 0 0 100px;
}
.main-partners-list li{
  margin-left: 65px;
}
.main-courses-container{
  font-family: "Rubik", sans-serif;
  margin-top: 30px;
}
.main-courses-container h2{
  font-size: 30px;
  text-align: center;
}
.main-courses-container p{
  text-align: center;
}

</style>