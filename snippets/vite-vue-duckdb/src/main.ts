import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './adapter/driver/presentation/App.vue'
import router from './adapter/driver/presentation/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
