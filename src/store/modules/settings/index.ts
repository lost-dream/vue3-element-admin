import { Module } from 'vuex'
import RootState from '@/store/interface'
import SettingState from './interface'
import variables from '@scss/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const settingsModule: Module<SettingState, RootState> = {
  namespaced: true,
  state: {
    theme: variables.theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  },
  mutations: {
    CHANGE_SETTING: (state: { [index: string]: any }, { key, value }) => {
      // eslint-disable-next-line no-prototype-builtins
      if (state.hasOwnProperty(key)) {
        state[key as keyof typeof state] = value
      }
    }
  },
  actions: {
    changeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}

export default settingsModule
