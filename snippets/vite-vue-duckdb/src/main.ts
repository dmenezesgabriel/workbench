import { createApp } from 'vue'
import { createPinia } from 'pinia'
import nunjucks from 'nunjucks'

nunjucks.configure('src/core/domain/resources/templates', { autoescape: true })

import App from './adapter/driver/presentation/App.vue'
import router from './adapter/driver/presentation/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
