import router from '@/router'
import store from '@/store/index'
import { configure, start, done } from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token fro
import { ElMessage } from 'element-plus'

configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async to => {
  start()

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      done()
      router.push({ path: '/' })
    } else {
      const hasRoles = store.getters.roles
      if (hasRoles) {
        return true
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          await store.dispatch('permission/generateRoutes', roles)

          const routes = store.state.permission.routes
          for (let i = 0; i < routes.length; i++) {
            router.addRoute(routes[i])
          }
        } catch (error) {
          ElMessage(error)
          done()
          return false
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      done()
      return true
    } else {
      done()
      router.push({
        name: 'Login',
        query: {
          redirect: to.path
        }
      })
      return true
    }
  }
})

router.afterEach(() => {
  done()
})
