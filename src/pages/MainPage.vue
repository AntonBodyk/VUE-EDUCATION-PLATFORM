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
  </main>
  <footer>
    <div class="footer-section">
        <div class="footer-lists-section">
          <ul class="first-list">
            <li><a href="#">SmartLearn Business</a></li>
            <li><a href="#">Преподавайте на SmartLearn</a></li>
            <li><a href="#">Скачать приложение</a></li>
            <li><a href="#">О нас</a></li>
            <li><a href="#">Наши координаты</a></li>
          </ul>
          <ul class="first-list">
            <li><a href="#">Карьера</a></li>
            <li><a href="#">Блог</a></li>
            <li><a href="#">Справка и поддержка</a></li>
            <li><a href="#">Партнер</a></li>
            <li><a href="#">Ивесторы</a></li>
          </ul>
          <ul class="first-list">
            <li><a href="#">Условия использования</a></li>
            <li><a href="#">Политика конфиденциальности</a></li>
            <li><a href="#">Настройки файлов cookie</a></li>
            <li><a href="#">Карта сайта</a></li>
            <li><a href="#">Заявление о доступности</a></li>
          </ul>
        </div>
        <div class="footer-items">
          <h3 class="footer-logo">SmartLearn</h3>
          <span>© 2024 SmartLearn, Inc.</span>
        </div>
    </div>
  </footer>
</template>



<script>
export default {

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
  width: 1360px;
  margin-left: 50px;
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
.footer-section{
  width: 100%;
  height: 300px;
  background-color: #364d79;
}
.footer-lists-section{
  display: flex;
  padding: 40px 0 0 10px;
}
.first-list{
  list-style-type: none;
}
.first-list:nth-child(2){
  margin-left: 50px;
}
.first-list:nth-child(3){
  margin-left: 50px;
}
.first-list li{
  margin-top: 10px;
}
.first-list a{
  color: white;
  text-decoration: none;
}
.footer-items{
  display: flex;
  margin: 50px 0 0 50px;
}
.footer-logo{
  font-family: 'Lemon', serif;
  color: white;
}
.footer-items span{
  color: white;
  font-family: "Rubik", sans-serif;
  margin: 5px 0 0 73%;
}
</style>