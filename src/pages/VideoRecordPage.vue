<template>
  <div class="video-page">
    <h1>Делитесь своими знаниями: создайте свой обучающий видеоролик!</h1>
    <br>
    <a-space class="video-btns">
      <a-button
          id="btn-start-recording"
          :disabled="disabled"
          @click="startRec"
          type="primary"
          class="start-record"
          ghost>Начать запись</a-button>
      <a-button
          id="btn-stop-recording"
          :disabled="!disabled"
          @click="stopRec"
          type="primary"
          danger ghost>Остановить запись</a-button>
    </a-space>
    <hr>
    <video class="video" controls autoplay playsinline ref="video" height="500" width="700"></video>
  </div>
</template>

<script>
import RecordRTC from "recordrtc";
export default {
  name: "VideoRecord",
  data() {
    return {
      recorder: null,
      disabled: false
    };
  },
  mounted() {},
  methods: {
    startRec() {
      this.disabled = true;
      this.captureCamera(camera => {
        const video = this.$refs["video"];
        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;
        this.recorder = RecordRTC(camera, {
          type: "video"
        });
        this.recorder.startRecording();

        this.recorder.camera = camera;

        this.disabled = true;
      });
    },
    stopRec() {
      this.disabled = false;
      this.recorder.stopRecording(this.stopRecordingCallback);
    },
    captureCamera(callback) {
      navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then(function(camera) {
            callback(camera);
          })
          .catch(function(error) {
            alert("Не удалось захватить камеру. Пожалуйста, проверьте консоль.");
            console.error(error);
          });
    },
    stopRecordingCallback() {
      const video = this.$refs["video"];
      video.src = video.srcObject = null;
      video.muted = false;
      video.volume = 1;
      video.src = URL.createObjectURL(this.recorder.getBlob());

      this.recorder.camera.stop();
      this.recorder.destroy();
      this.recorder = null;
    }
  }
};
</script>

<style scoped>
.video-page{
  font-family: "Rubik", sans-serif;
}
.video-page h1{
  text-align: center;
  margin-top: 30px;
  color: #364d79;
}
.video-btns{
  margin-left: 40%;
}
.start-record{
  color: #364d79;
  border-color: #364d79;
}
.video{
  margin: 0 0 20px 25%;
}
</style>