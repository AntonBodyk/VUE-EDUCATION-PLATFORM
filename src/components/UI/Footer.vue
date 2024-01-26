<template>
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
  name: "Footer.vue"
}
</script>

<style scoped>
.footer-section{
  width: 100%;
  height: 300px;
  margin-top: auto;
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