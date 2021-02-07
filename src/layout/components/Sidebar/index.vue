<template>
  <el-scrollbar class="sidebar-container" wrap-class="scrollbar-wrapper">
    <el-menu
      class="sidebar-menu"
      :default-active="activeMenu"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
    >
      <sidebar-item v-for="v in permissionRoutes" :key="v.path" :item="v" :base-path="v.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import styles from '@scss/variables.scss'

export default defineComponent({
  name: 'LayoutMenubar',
  components: {
    SidebarItem
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const variables = computed(() => styles)
    const sidebar = computed(() => store.getters.sidebar)
    const isCollapse = computed(() => !sidebar.value.opened)
    const permissionRoutes = computed(() => store.getters.permissionRoutes)

    const activeMenu = computed(() => {
      if (route.meta.activeMenu) return route.meta.activeMenu
      return route.path
    })

    return {
      activeMenu,
      variables,
      sidebar,
      permissionRoutes,
      isCollapse
    }
  }
})
</script>

<style scoped lang="scss">
.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  background-color: $menuBg;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;

  ::v-deep(.horizontal-collapse-transition) {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  ::v-deep(.scrollbar-wrapper) {
    overflow-x: hidden !important;
  }

  ::v-deep(.el-scrollbar__bar.is-vertical) {
    right: 0px;
  }

  ::v-deep(.el-scrollbar) {
    height: 100%;
  }

  // &.has-logo {
  //   .el-scrollbar {
  //     height: calc(100% - 50px);
  //   }
  // }

  ::v-deep(.is-horizontal) {
    display: none;
  }

  .sidebar-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }

  &.hideSidebar {
    width: 54px !important;

    ::v-deep(.submenu-title-noDropdown) {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;

        ::v-deep(.svg-icon) {
          margin-left: 20px;
        }

        .sub-el-icon {
          margin-left: 19px;
        }
      }
    }

    ::v-deep(.el-submenu) {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0 !important;

        .svg-icon {
          margin-left: 20px;
        }

        .sub-el-icon {
          margin-left: 19px;
        }

        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }

    ::v-deep(.el-menu--collapse) {
      .el-submenu {
        & > .el-submenu__title {
          & > span {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
          }
          & > .el-submenu__icon-arrow {
            display: none;
          }
        }
      }
    }

    ::v-deep(.el-menu--collapse) .el-menu .el-submenu {
      min-width: $sideBarWidth !important;
    }
  }
}
</style>
