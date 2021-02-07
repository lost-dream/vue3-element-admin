<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { compile } from 'path-to-regexp'
import { reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface State {
  levelList: any
}

export default {
  name: 'Breadcrumb',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const state = reactive<State>({
      levelList: null
    })

    function isDashboard(route: any): boolean {
      const name = route && route.name
      if (!name) {
        return false
      }
      return (name as string).trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    }

    function getBreadcrumb() {
      let matched: any = route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched)
      }

      state.levelList = matched.filter(
        (item: any) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    }

    function pathCompile(path: string) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = route
      const toPath = compile(path)
      return toPath(params)
    }

    function handleLink(item: any) {
      const { redirect, path } = item
      if (redirect) {
        router.push(redirect)
      } else {
        router.push(pathCompile(path))
      }
    }

    watch(
      () => route.path,
      route => {
        // if you go to the redirect page, do not update the breadcrumbs
        if (route.startsWith('/redirect/')) return
        getBreadcrumb()
      }
    )

    getBreadcrumb()
    return {
      ...toRefs(state),
      isDashboard,
      getBreadcrumb,
      pathCompile,
      handleLink
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
