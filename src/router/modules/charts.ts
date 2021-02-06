import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout'
const chartRoutes: Array<RouteRecordRaw> = [
  {
    path: '/chart',
    component: Layout,
    name: 'Chart',
    meta: {
      title: 'Chart',
      icon: 'chart'
    },
    children: [
      {
        path: 'keyboard',
        component: () => import('@/views/charts/keyboard'),
        name: 'KeyboardChart',
        meta: { title: 'Keyboard Chart', noCache: true }
      },
      {
        path: 'line',
        component: () => import('@/views/charts/line'),
        name: 'LineChart',
        meta: { title: 'Line Chart', noCache: true }
      }
    ]
  }
]

export default chartRoutes
