import { Module } from 'vuex'
import RootState from '@/store/interface'
import LayoutState from './interface'
import { MenubarStatus } from '@/types/Layout'

const layoutModule: Module<LayoutState, RootState> = {
  namespaced: true,
  state: {
    menubar: {
      status: document.body.offsetWidth < 768 ? MenubarStatus.PHN : MenubarStatus.PCE,
      menuList: [],
      isPhone: document.body.offsetWidth < 768
    },
    userInfo: {
      name: '',
      role: []
    },
    tags: {
      tagsList: [],
      cachedViews: []
    },
    ACCESS_TOKEN: localStorage.getItem('ACCESS_TOKEN') || '',
    theme: localStorage.getItem('theme') ? Number(localStorage.getItem('theme')) : 0,
    isLoading: false
  }
}

export default layoutModule
