import { createApp } from 'vue'
import './assets/index.css'
import Vue3Resize from 'vue3-resize'
import 'vue3-resize/dist/vue3-resize.css'
import App from './App.vue'

createApp(App)
    .use(Vue3Resize)
    .mount('#app')