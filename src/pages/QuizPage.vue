<template>
  <div v-if="quizNotFound">
    <NotFoundPage/>
  </div>
  <div class="test-page" v-else>
    <div class="courses-list-empty" v-if="showSpinner">
      <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
    <div class="test-page-block">
      <div v-if="currentQuestion && !showResults && !showSpinner">
        <h3>{{ currentQuestion.question_title }}</h3>
        <div v-for="(answer, answerIndex) in currentQuestion.answers" :key="answerIndex">
          <label class="checkbox-container">
            <input type="checkbox" v-model="selectedAnswers[currentQuestionIndex]" :value="answer.answer_text" class="answer-checkbox">
            <span class="checkmark"></span>
          </label>
          <p class="answer-text">{{ answer.answer_text }}</p>
        </div>
        <a-space wrap>
          <a-button type="primary" @click="submitAnswer(currentQuestionIndex)" class="answer-question">Ответить</a-button>
        </a-space>
      </div>
      <div v-if="showResults">
        <h2>Результаты теста:</h2>
        <h3>{{ resultTitle }}</h3>
        <p>{{ resultMessage }}</p>
        <p>Правильных ответов: {{ correctAnswers }} из {{ questions.length }}</p>
        <a-space wrap>
          <a-button type="primary" @click="navigateToMainPage">Вернуться к курсу</a-button>
          <a-button type="primary" @click="returnToQuizAgain">Пройти тест еще раз</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { instance } from '@/axios/axiosInstance';
import { useUserStore } from "@/store/userStore";
import router from "@/routes/router";
import { message } from "ant-design-vue";
import NotFoundPage from "@/pages/NotFoundPage.vue";
import {useRoute} from "vue-router";

export default {
  components:{
    NotFoundPage
  },
  data() {
    return {
      questions: [],
      selectedAnswers: [],
      showResults: false,
      userStore: useUserStore(),
      correctAnswers: 0,
      showSpinner: false,
      currentQuestionIndex: 0,
      currentQuestion: null,
      quizNotFound: false,
      route: useRoute(),
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
      if (error.response && error.response.status === 404) {
        this.quizNotFound = true;
      } else {
        console.error('Error fetching post data', error);
      }
    } finally {
      this.showSpinner = false;
    }
  },
  methods: {
    async submitAnswer(questionIndex) {
      const selectedAnswers = this.selectedAnswers[questionIndex];
      const question = this.questions[questionIndex];
      const testId = this.$route.params.id;
      this.showSpinner = true;
      try {
        const response = await instance.post(`/tests/${testId}/submit-answer`, {
          question_id: question.id,
          selected_answers: selectedAnswers
        });

        const correctAnswers = response.data.correctAnswers;

        this.correctAnswers += correctAnswers;


        await this.saveTestResults(this.correctAnswers);

        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.nextQuestion();
        } else {
          this.showResults = true;
        }
      } catch (error) {
        console.error('Ошибка при отправке ответа:', error);
      } finally {
        this.showSpinner = false;
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
    navigateToMainPage() {
      message.success('Поздравляем, Вы закончили курс!');
      return router.back();
    },
    returnToQuizAgain(){
      return window.location.reload();
    },
    setCurrentQuestion() {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    },
    nextQuestion() {
      this.currentQuestionIndex++;
      this.setCurrentQuestion();
    },
  },
  computed: {
    resultTitle() {
      let title;
      if (this.correctAnswers === this.questions.length) {
        title = 'Поздравляем! 🏆';
      } else if ((this.correctAnswers * 100) / this.questions.length >= 50) {
        title = 'Неплохой результат! 😉';
      } else {
        title = 'Стоит постараться! 😐';
      }
      return title;
    },
    resultMessage() {
      let message;
      if (this.correctAnswers === this.questions.length) {
        message = 'Вы ответили правильно на все вопросы! 👍';
      } else if ((this.correctAnswers * 100) / this.questions.length >= 50) {
        message = 'Вы ответили правильно на большую часть вопросов! 👍';
      } else {
        message = 'Вы ответили неправильно! Попробуйте пройти тест снова!';
      }
      return message;
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