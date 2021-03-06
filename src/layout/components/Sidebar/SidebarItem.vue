<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
          @click="handleCloseSidebar"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
            :isNext="false"
          />
          <template #title>
            <span v-if="onlyOneChild.meta.title"> {{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item
          v-if="item.meta"
          :isNext="true"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
        <span v-if="item.meta.title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { isExternal } from '@/utils/validate'
import path from 'path'
import Item from './Item.vue'
import AppLink from './Link.vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  components: {
    Item,
    AppLink
  },
  setup(props) {
    const store = useStore()
    const state = reactive({
      onlyOneChild: null
    })

    const device = computed(() => store.state.app.device)

    function hasOneShowingChild(children = [], parent: any) {
      const showingChildren = children.filter(item => {
        if (props.item.hidden) {
          return false
        } else {
          state.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        state.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    }

    function resolvePath(routePath: string) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    function handleCloseSidebar() {
      if (device.value === 'mobile') {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }

    return {
      ...toRefs(state),
      hasOneShowingChild,
      resolvePath,
      handleCloseSidebar,
      device
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.sub-el-icon) {
  margin-right: 12px;
  margin-left: -2px;
}

::v-deep(.svg-icon) {
  margin-right: 16px;
}

a {
  display: inline-block;
  width: 100%;
  overflow: hidden;
}

// menu hover
.submenu-title-noDropdown,
::v-deep(.el-submenu__title) {
  &:hover {
    background-color: $menuHover !important;
  }
}

.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.nest-menu .el-submenu > .el-submenu__title,
.el-submenu .el-menu-item {
  min-width: $sideBarWidth !important;
  background-color: $subMenuBg !important;

  &:hover {
    background-color: $subMenuHover !important;
  }
}
</style>
