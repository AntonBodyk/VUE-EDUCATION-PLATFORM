

<template>
  <div>
    <h2>Quiz</h2>
    <div v-for="(question, index) in questions" :key="index">
      <p>{{ question.text }}</p>
      <ul>
        <li v-for="(option, i) in question.options" :key="i">
          <input type="radio" :id="'option-' + index + '-' + i" :value="option" v-model="selected[index]">
          <label :for="'option-' + index + '-' + i">{{ option }}</label>
        </li>
      </ul>
    </div>
    <button @click="submitQuiz">Submit</button>
    <p v-if="showResult">Your score: {{ score }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [/* массив объектов с вопросами и ответами */],
      selected: [],
      showResult: false,
      score: 0
    };
  },
  methods: {
    submitQuiz() {
      // Подсчет правильных ответов
      let correctAnswers = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if (this.selected[i] === this.questions[i].correctAnswer) {
          correctAnswers++;
        }
      }
      this.score = (correctAnswers / this.questions.length) * 100;
      this.showResult = true;

      // Здесь можно отправить результаты на сервер или управлять завершением курса
    }
  }
};
</script>

<style scoped>

</style>