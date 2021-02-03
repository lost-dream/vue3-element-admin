import router from '@/router'
import store from '@/store/index'
import { constantRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import { configure, start, done } from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token fro

configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from) => {
  start()

  const hasToken = getToken()

  console.log('to,form :>> ', to, from)
  if (hasToken) {
    if (to.path === '/login') {
      done()
      router.push({ path: '/' })
    } else {
      const hasRoles = store.getters.roles
      console.log('hasRoles :>> ', hasRoles)
      if (hasRoles) {
        return true
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          console.log('roles :>> ', roles)
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          const routes = store.state.permission.routes
          for (let i = 0; i < routes.length; i++) {
            console.log('object :>> ', routes[i])
            router.addRoute(routes[i])
          }
        } catch (error) {
          console.log('error :>> ', error)
          done()
          return false
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      done()
      return false
    } else {
      done()
      router.push({
        name: 'Login',
        query: {
          redirect: to.path
        }
      })
    }
  }
})

router.afterEach(() => {
  done()
})
