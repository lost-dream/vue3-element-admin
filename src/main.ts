import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
import router from './router'
import store, { key } from './store'
import installElementPlus from './plugins/element'
import '@scss/index.scss'

import './permission'
import icons from '@/icons'

icons(app)

app
  .use(installElementPlus)
  .use(store, key)
  .use(router)
  .mount('#app')
