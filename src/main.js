import { createApp } from 'vue'
import './style.css'
import Vue3Resize from 'vue3-resize'
import 'vue3-resize/dist/vue3-resize.css'
import App from './App.vue'

const app = createApp(App)
app.use(Vue3Resize)
app.mount('#app')