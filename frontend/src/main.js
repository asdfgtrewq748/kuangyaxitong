import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { provideToast } from './composables/useToast'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const toastRef = provideToast(app)
app.config.globalProperties.$toast = toastRef

// 初始化应用状态
import { useAppStore } from './stores'
const appStore = useAppStore()
appStore.initialize()

app.mount('#app')
