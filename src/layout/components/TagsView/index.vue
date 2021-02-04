<template>
  <div id="tags-view-container" class="tags-view-container" ref="tagsViewContainer">
    <scroll-pane ref="scrollPaneWrapper" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="(tag, i) in visitedViews"
        :ref="el => (tagList[i] = tag)"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts">
import ScrollPane from './ScrollPane.vue'
import path from 'path'
import {
  computed,
  reactive,
  toRefs,
  ref,
  nextTick,
  watch,
  onMounted,
  getCurrentInstance,
  Ref
} from 'vue'
import { useStore } from '@/store'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'

interface State {
  visible: boolean
  top: number
  left: number
  selectedTag: { [index: string]: any }
  affixTags: Array<any>
}

export default {
  name: 'TagsView',
  components: { ScrollPane },
  setup() {
    const _this = getCurrentInstance()
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const tagList: Ref<Array<any>> = ref([])
    const scrollPaneWrapper = ref()

    const state = reactive<State>({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    })

    const visitedViews = computed(() => store.state.tagsView.visitedViews)
    const routes = computed(() => store.state.permission.routes)

    const isActive = (curRoute: RouteRecordRaw) => curRoute.path === route.path

    const isAffix = (tag: RouteRecordRaw) => tag.meta && tag.meta.affix

    function filterAffixTags(routes: Array<any>, basePath = '/') {
      let tags: Array<any> = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    }

    function initTags() {
      const affixTags = (state.affixTags = filterAffixTags(routes.value))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    }

    function addTags() {
      if (route.name) {
        store.dispatch('tagsView/addView', route)
      }
      return false
    }

    function moveToCurrentTag() {
      nextTick(() => {
        for (const item of tagList.value) {
          if (item.path === route.path) {
            scrollPaneWrapper.value.moveToTarget(item)
            // when query is different then update
            if (item.fullPath !== route.fullPath) {
              store.dispatch('tagsView/updateVisitedView', route)
            }
            break
          }
        }
      })
    }

    function refreshSelectedTag(view: any) {
      store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        nextTick(() => {
          router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    }

    function toLastView(visitedViews: any, view: any) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          router.replace({ path: '/redirect' + view.fullPath })
        } else {
          router.push('/')
        }
      }
    }

    function closeSelectedTag(view: any) {
      store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (isActive(view)) {
          toLastView(visitedViews, view)
        }
      })
    }

    function closeOthersTags() {
      router.push(state.selectedTag)
      store.dispatch('tagsView/delOthersViews', state.selectedTag).then(() => {
        moveToCurrentTag()
      })
    }

    function closeAllTags(view: any) {
      store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (state.affixTags.some(tag => tag.path === view.path)) return

        toLastView(visitedViews, view)
      })
    }

    function closeMenu() {
      state.visible = false
    }

    function handleScroll() {
      closeMenu()
    }

    function openMenu(tag: any, e: MouseEvent) {
      const menuMinWidth = 105
      const tagsViewContainer = _this?.vnode.el
      const offsetLeft = tagsViewContainer?.getBoundingClientRect().left // container margin left
      const offsetWidth = tagsViewContainer?.getBoundingClientRect().offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        state.left = maxLeft
      } else {
        state.left = left
      }

      state.top = e.clientY
      state.visible = true
      state.selectedTag = tag
    }

    watch(
      () => route.path,
      () => {
        addTags()
        moveToCurrentTag()
      }
    )

    watch(
      () => state.visible,
      value => {
        if (value) {
          document.body.addEventListener('click', closeMenu)
        } else {
          document.body.removeEventListener('click', closeMenu)
        }
      }
    )

    onMounted(() => {
      initTags()
      addTags()
    })

    return {
      ...toRefs(state),
      visitedViews,
      routes,
      isActive,
      isAffix,
      refreshSelectedTag,
      closeSelectedTag,
      closeOthersTags,
      closeAllTags,
      handleScroll,
      openMenu,
      tagList,
      scrollPaneWrapper
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
