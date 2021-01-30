/* eslint-disable @typescript-eslint/camelcase */
import { createI18n } from 'vue-i18n'
import en from './modules/en'
import zh_CN from './modules/zh_CN'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'

const messages = {
  [enLocale.name]: {
    el: enLocale.el,
    ...en
  },
  [zhLocale.name]: {
    el: zhLocale.el,
    ...zh_CN
  }
}

const i18n = createI18n({
  locale: zhLocale.name,
  fallbackLocale: enLocale.name,
  messages
})

export default i18n
