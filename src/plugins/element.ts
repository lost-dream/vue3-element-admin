import ElementPlus from 'element-plus'
import '@/assets/scss/element-variables.scss'
import { App } from 'vue'

export default (app: App) => {
  app.config.globalProperties.$ELEMENT = { size: 'medium', zIndex: 3000 }
  app.use(ElementPlus)
}
