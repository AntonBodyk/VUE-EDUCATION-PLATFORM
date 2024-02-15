import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';


const pinia = createPinia();

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: "12cadc29b6914262effb",
    cluster: "mt1",
    forceTLS: true,
    encrypted: true,
});

window.Echo.channel('reportGeneration')
    .listen('PdfGenerated', (event) => {
        console.log('PDF generated:', event);

    });
createApp(App)
    .use(Antd)
    .use(router)
    .use(pinia)
    .mount('#app')
