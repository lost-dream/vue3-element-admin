<template>
  <div class="flex items-center px-4">
    <span
      class="text-2xl cursor-pointer"
      :class="{ 'el-icon-s-fold': !menubar.status, 'el-icon-s-unfold': menubar.status }"
      @click="changeCollapsed"
    />
    <!-- 面包屑导航 -->
    <div class="px-4">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          主页
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="v in data.breadcrumbList" :key="v.path" :to="v.path">
          {{ v.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
  <div class="flex items-center flex-row-reverse px-4 min-width-32">
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-link href="https://github.com/hsiangleev" target="_blank" :underline="false">
              个人中心
            </el-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-link
              href="https://github.com/hsiangleev/element-plus-admin"
              target="_blank"
              :underline="false"
            >
              项目地址
            </el-link>
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import { useStore } from '@/store/index'
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router'

interface BreadcrumbList {
  path: string
  title: string | symbol
}
// 面包屑导航
const breadcrumb = (route: RouteLocationNormalizedLoaded) => {
  const fn = () => {
    const breadcrumbList: Array<BreadcrumbList> = []
    if (route.matched[0] && route.matched[0].name === 'Dashboard') return breadcrumbList
    route.matched.forEach(v => {
      const obj: BreadcrumbList = {
        title: v.meta.title,
        path: v.path
      }
      breadcrumbList.push(obj)
    })
    return breadcrumbList
  }
  const data = reactive({
    breadcrumbList: fn()
  })
  watch(
    () => route.path,
    () => (data.breadcrumbList = fn())
  )
  return data
}

export default defineComponent({
  name: 'LayoutNavbar',
  setup() {
    const store = useStore()
    const route = useRoute()
    const changeCollapsed = () => store.commit('layout/changeCollapsed')
    const logout = () => store.commit('layout/logout')
    const data = breadcrumb(route)
    return {
      menubar: store.state.layout.menubar,
      userInfo: store.state.layout.userInfo,
      changeCollapsed,
      logout,
      data
    }
  }
})
</script>