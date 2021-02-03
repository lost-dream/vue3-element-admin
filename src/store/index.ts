import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import getters from '@/store/getters'
import { AllState } from './interface'
import createPersistedState from 'vuex-persistedstate'
import layout from './modules/layout'
import user from './modules/user'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'

export default createStore<AllState>({
  getters: getters,
  modules: {
    layout,
    user,
    app,
    permission,
    settings
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
    })
  ]
})

export const key: InjectionKey<Store<AllState>> = Symbol()

export function useStore<T = AllState>() {
  return baseUseStore<T>(key)
}
