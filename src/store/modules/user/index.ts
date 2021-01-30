import { Module } from 'vuex'
import RootState from '@/store/interface'
import UserState from './interface'
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { useRouter } from 'vue-router'

const userModule: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password })
          .then(response => {
            const { data } = response
            commit('SET_TOKEN', data.token)
            setToken(data.token)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token as string)
          .then(response => {
            const { data } = response

            if (!data) {
              reject('Verification failed, please Login again.')
            }

            const { roles, name, avatar, introduction } = data

            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
              reject('getInfo: roles must be a non-null array!')
            }

            commit('SET_ROLES', roles)
            commit('SET_NAME', name)
            commit('SET_AVATAR', avatar)
            commit('SET_INTRODUCTION', introduction)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    logout({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            // resetRouter() // TODO vue3 怎么刷新路由

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            dispatch('tagsView/delAllViews', null, { root: true })
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    resetToken({ commit }, callback: Function) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve(callback)
      })
    },
    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
      const router = useRouter()
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      // resetRouter() // TODO vue3 怎么刷新路由

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // dynamically add accessible routes
      router.addRoute(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })
    }
  }
}

export default userModule
