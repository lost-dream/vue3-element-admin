import ElementPlus from 'element-plus'
import '@/assets/scss/element-variables.scss'
import { App } from 'vue'
import i18n from '@/lang'

export default (app: App) => {
  app.config.globalProperties.$ELEMENT = { size: 'medium', zIndex: 3000 }
  app.use(ElementPlus, {
    i18n: i18n.global.t
  })
  app.use(i18n)
}
