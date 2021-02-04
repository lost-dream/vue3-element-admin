<template>
  <div :class="{ show: show }" class="header-search">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import Fuse from 'fuse.js'
import path from 'path'
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface State {
  search: string
  options: Array<any>
  searchPool: Array<any>
  show: boolean
  fuse: any
}

export default defineComponent({
  name: 'HeaderSearch',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const state = reactive<State>({
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    })

    const headerSearchSelect = ref()

    const routes = computed(() => store.getters.permissionRoutes)

    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    function generateRoutes(routes: Array<any>, basePath = '/', prefixTitle: Array<any> = []) {
      let res: Array<any> = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) {
          continue
        }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }

    function initFuse(list: any) {
      state.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: 'title',
            weight: 0.7
          },
          {
            name: 'path',
            weight: 0.3
          }
        ]
      })
    }

    function close() {
      headerSearchSelect.value && headerSearchSelect.value.blur()
      state.options = []
      state.show = false
    }

    function click() {
      state.show = !state.show
      if (state.show) {
        headerSearchSelect.value && headerSearchSelect.value.focus()
      }
    }

    function change(val: any) {
      router.push(val.path)
      state.search = ''
      state.options = []
      nextTick(() => {
        state.show = false
      })
    }

    function querySearch(query: any) {
      if (query !== '') {
        state.options = state.fuse.search(query)
      } else {
        state.options = []
      }
    }

    watch(
      () => route.path,
      () => {
        state.searchPool = generateRoutes(routes.value)
      }
    )

    watch(
      () => state.searchPool,
      list => {
        initFuse(list)
      }
    )

    watch(
      () => state.show,
      value => {
        if (value) {
          document.body.addEventListener('click', close)
        } else {
          document.body.removeEventListener('click', close)
        }
      }
    )

    onMounted(() => {
      state.searchPool = generateRoutes(routes.value)
    })

    return {
      ...toRefs(state),
      routes,
      headerSearchSelect,
      generateRoutes,
      initFuse,
      close,
      click,
      change,
      querySearch
    }
  }
})
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
