import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw as BaseRouteRecordRaw
} from 'vue-router'
import Layout from '@/layout'

import chartsRouter from './modules/charts'

interface ExtendsParams {
  /***
   * if set true, will always show the root menu
   * if not set alwaysShow, when item has more than one children route,
   * it will becomes nested mode, otherwise not show the root menu */
  alwaysShow?: boolean
  /*** 是否在侧边栏中显示, 默认 false -- 不显示 */
  hidden?: boolean
}

type RouteRecordRaw = ExtendsParams & BaseRouteRecordRaw

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:pathMatch(.*)*',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  ...chartsRouter
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
