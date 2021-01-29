import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import '@scss/index.scss'

app
  .use(installElementPlus)
  .use(store)
  .use(router)
  .mount('#app')
