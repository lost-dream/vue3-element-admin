import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import getters from '@/store/getters'
import { AllState } from './interface'
import createPersistedState from 'vuex-persistedstate'
import layout from './modules/layout'

export default createStore<AllState>({
  getters: getters,
  modules: {
    layout
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
