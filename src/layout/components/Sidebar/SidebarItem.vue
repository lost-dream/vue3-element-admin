<template>
  <div v-if="!item.meta || (item.meta && !item.meta.hidden)">
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
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
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
import { defineComponent, reactive, toRefs } from 'vue'
import { isExternal } from '@/utils/validate'
import path from 'path'
import Item from './Item.vue'
import AppLink from './Link.vue'

export default defineComponent({
  name: 'MenubarItem',
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
    const state = reactive({
      onlyOneChild: null
    })

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

    return {
      ...toRefs(state),
      hasOneShowingChild,
      resolvePath
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
