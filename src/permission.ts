import router from '@/router'
import store from '@/store/index'
import { configure, start, done } from 'nprogress'

configure({ showSpinner: false })

const loginRoutePath = '/login'
const defaultRoutePath = '/'

router.beforeEach(async (to, from) => {
  start()
  const { user } = store.state

  // 判断当前是否在登陆页面
  if (to.path.toLocaleLowerCase() === loginRoutePath.toLocaleLowerCase()) {
    done()
    if (user.token) return defaultRoutePath
    return
  }
  // // 判断是否登录
  if (!user.token) {
    return loginRoutePath
  }
  document.title = document.title
    ? document.title.split(' |')[0] + ' | ' + to.meta.title
    : to.meta.title
  // // 判断是否还没添加过路由
  // if (layout.menubar.menuList.length === 0) {
  //   await store.dispatch('layout/GenerateRoutes')
  //   await store.dispatch('layout/getUser')
  //   for (let i = 0; i < layout.menubar.menuList.length; i++) {
  //     router.addRoute(layout.menubar.menuList[i])
  //   }
  //   store.commit('layout/concatAllowRoutes')
  //   return to.fullPath
  // }
  const { roles } = await store.dispatch('user/getInfo')
  const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
  store.commit('layout/changeTagNavList', to) // 切换导航，记录打开的导航(标签页)

  // 离开当前页面时是否需要添加当前页面缓存
  !new RegExp(/^\/redirect\//).test(from.path) &&
    store.state.layout.tags.tagsList.some(v => v.name === from.name) &&
    !store.state.layout.tags.cachedViews.some(v => v === from.name) &&
    store.commit('layout/addCachedViews', { name: from.name, noCache: from.meta.noCache })
})

router.afterEach(() => {
  done()
})
