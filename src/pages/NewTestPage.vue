<template>
  <div class="new-test-page">
    <h1>Новый тест</h1>
    <form @submit.prevent="submitTest">
      <a-space direction="vertical">
        <a-input v-model:value="testTitle" placeholder="Название теста" class="test-title" name="title"/>
      </a-space>
      <div v-for="(question, index) in questions" :key="index">
        <h3>Вопрос {{ index + 1 }}</h3>

        <a-textarea v-model:value="question.questionText" placeholder="Введите вопрос" class="question-text"/>
        <div v-for="(answer, answerIndex) in question.answers" :key="answerIndex">

          <a-space direction="vertical" class="answer-block">
            <label class="answer-label">Ответ {{ answerIndex + 1 }}</label>
            <a-input v-model:value="answer.answerText" placeholder="Введите ответ" name="answer_text" class="answer-text"  />
            <a-checkbox v-model:checked="answer.isCorrect" name="is_correct"></a-checkbox>
          </a-space>
        </div>
        <a-space>
          <a-button type="primary" @click="addAnswer(index)" class="add-answer" ghost>Добавить ответ</a-button>
        </a-space>
      </div>
      <a-space>
        <a-button type="primary" @click="addQuestion" class="add-question" ghost>Добавить вопрос</a-button>
      </a-space>
      <a-space>
        <a-button type="primary" @click="submitTest" class="save-test">Сохранить тест</a-button>
      </a-space>
    </form>
  </div>
</template>

<script>
import {instance} from "@/axios/axiosInstance";
import {useUserStore} from "@/store/userStore";
import {message} from "ant-design-vue";
import router from "@/routes/router";

export default {
  data() {
    return {
      userStore: useUserStore(),
      testTitle: '',
      activeQuestionIndex: 0,
      questions: [{
        questionText: '',
        answers: [{ answerText: '', isCorrect: false }]
      }]
    };
  },
  methods: {
    addQuestion() {
      this.questions.push({
        questionText: '',
        answers: [{ answerText: '', isCorrect: false }]
      });
      this.activeQuestionIndex = this.questions.length - 1;
    },
    addAnswer(questionIndex) {
      this.questions[questionIndex].answers.push({ answerText: '', isCorrect: false });
    },
    async submitTest() {
      const courseId = this.$route.params.id;

      if (!this.testTitle.trim()) {
        message.error('Введите название теста');
        return;
      }

      for (const question of this.questions) {
        if (!question.questionText.trim()) {
          message.error('Введите текст вопроса');
          return;
        }

        for (const answer of question.answers) {
          if (!answer.answerText.trim()) {
            message.error('Введите текст ответа');
            return;
          }
        }
      }

      try {
        const response = await instance.post('/tests', {
          questions: this.questions,
          title: this.testTitle,
          course_id: courseId,
          teacher_id: this.userStore.user.id,
        });
        message.success('Тест успешно создан');
        router.back();
      } catch (error) {
        console.error('Ошибка при создании теста:', error);
      }
    }
  }
};
</script>

<style scoped>
.new-test-page{
  font-family: "Rubik", sans-serif;
}
.new-test-page h1{
  font-size: 40px;
  text-align: center;
  margin-top: 30px;
  color: #364d79;
}
.test-title{
  margin: 20px 0 0 580px;
  width: 300px;
}
.new-test-page h3{
  font-size: 20px;
  text-align: center;
  margin-top: 30px;
  color: #364d79;
}
.answer-block{
  margin: 20px 0 0 580px;
}
.answer-label{
  color: #364d79;
}
.question-text{
  width: 300px;
  margin: 20px 0 0 580px;
}
.answer-text{
  width: 300px;
}
.add-answer{
  margin: 20px 0 0 580px;
}
.add-question{
  margin: 20px 0 30px 580px;
}
.save-test{
  margin-left: 30px;
}
</style>