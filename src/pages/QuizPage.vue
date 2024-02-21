<template>
  <div class="test-page">
    <div class="courses-list-empty" v-if="showSpinner">
      <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="test-page-block">
      <div v-for="(question, index) in questions" :key="index" v-if="currentQuestionIndex < questions.length && !showResults">
        <h3>{{ question.question_title }}</h3>
        <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
          <label class="checkbox-container">
            <input type="checkbox" v-model="selectedAnswers[index]" :value="answer.answer_text" class="answer-checkbox">
            <span class="checkmark"></span>
          </label>
          <p class="answer-text">{{ answer.answer_text }}</p>
        </div>
        <a-space wrap>
          <a-button type="primary" @click="submitAnswer(index)" class="answer-question">Ответить</a-button>
        </a-space>
      </div>
      <div v-if="showResults">
        <h2>Результаты теста:</h2>
        <p>Правильных ответов: {{ correctAnswers }}</p>
        <a-space wrap>
          <a-button type="primary" @click="navigateToMainPage">Перейти на главную</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { instance } from '@/axios/axiosInstance';
import {useUserStore} from "@/store/userStore";
import router from "@/routes/router";
import {message} from "ant-design-vue";

export default {
  data() {
    return {
      questions: [],
      selectedAnswers: [],
      showResults: false,
      userStore: useUserStore(),
      correctAnswers: 0,
      showSpinner: false,
      currentQuestionIndex: 0,
      currentQuestion: null
    };
  },
  async mounted() {
    const testId = this.$route.params.id;
    try {
      this.showSpinner = true;

      const response = await instance.get(`/tests/${testId}`);
      const testData = response.data;
      this.testTitle = testData.title;
      this.questions = testData.questions;
      this.selectedAnswers = new Array(this.questions.length).fill([]);

      this.setCurrentQuestion();
    } catch (error) {
      console.error('Ошибка при загрузке данных теста:', error);
    }finally {
      this.showSpinner = false;
    }
  },
  methods: {
    async submitAnswer(questionIndex) {
      const selectedAnswers = this.selectedAnswers[questionIndex];
      console.log(selectedAnswers);
      const question = this.questions[questionIndex];
      const testId = this.$route.params.id;
      try {
        const response = await instance.post(`/tests/${testId}/submit-answer`, {
          question_id: question.id,
          selected_answers: selectedAnswers
        });
        // После получения ответа от сервера
        console.log(response.data);
        const correctAnswers = response.data.correctAnswers;

        // Сохраняем результаты теста в таблице completed_tests
        await this.saveTestResults(correctAnswers);

        // Показываем результаты теста пользователю
        this.showResults = true;
        this.correctAnswers = correctAnswers;

        // Проверяем, есть ли еще вопросы
        if (this.currentQuestionIndex < this.questions.length - 1) {
          // Если есть, переходим к следующему вопросу
          this.nextQuestion();
        } else {
          // Иначе показываем результаты
          this.showResults = true;
        }
      } catch (error) {
        console.error('Ошибка при отправке ответа:', error);
      }
    },
    async saveTestResults(correctAnswers) {
      const testId = this.$route.params.id;
      const userId = this.userStore.user.id;

      try {
        await instance.post(`/completed-tests`, {
          user_id: userId,
          test_id: testId,
          score: correctAnswers
        });
      } catch (error) {
        console.error('Ошибка при сохранении результатов теста:', error);
      }
    },
    navigateToMainPage(){
      message.success('Поздравляем, Вы закончили курс!');
      return router.back();
    },
    setCurrentQuestion() {
      // Устанавливаем текущий вопрос
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    },
    nextQuestion() {
      // Увеличиваем индекс текущего вопроса
      this.currentQuestionIndex++;
      // Проверяем, есть ли еще вопросы
      if (this.currentQuestionIndex < this.questions.length) {
        // Если есть, устанавливаем следующий вопрос
        this.setCurrentQuestion();
      }
    }
  }
};
</script>

<style scoped>
.answer-text{
  margin: 3px 0 0 25px;
}
.test-page{
  font-family: "Rubik", sans-serif;
}
.answer-question{
  margin-top: 20px;
}
.test-page-block{
  margin: 50px 0 0 40%;
}
.test-page-block h3{
  font-size: 30px;
  color: #364d79;
}
.answer-checkbox {
  margin-bottom: 10px;
}

.checkbox-container {
  display: block;
  width: 19px;
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 3px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #2196F3;
}
.lds-default {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: 10% 0 0 48%;
}
.lds-default div {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #364d79;
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 37px;
  left: 66px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 22px;
  left: 62px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 11px;
  left: 52px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 7px;
  left: 37px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 11px;
  left: 22px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 22px;
  left: 11px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 37px;
  left: 7px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 52px;
  left: 11px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 62px;
  left: 22px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 66px;
  left: 37px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 62px;
  left: 52px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 52px;
  left: 62px;
}
@keyframes lds-default {
  0%, 20%, 80%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>