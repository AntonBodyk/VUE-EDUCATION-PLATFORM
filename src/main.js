import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { createPinia } from 'pinia';
const pinia = createPinia();

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '1f6e0cb5687fa71fe5f7',
    cluster: 'eu',
    forceTLS: true
});


createApp(App)
    .use(Antd)
    .use(router)
    .use(pinia)
    .mount('#app')
