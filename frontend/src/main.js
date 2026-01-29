import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { provideToast } from './composables/useToast'

const app = createApp(App)

app.use(router)

const toastRef = provideToast(app)
app.config.globalProperties.$toast = toastRef

app.mount('#app')
