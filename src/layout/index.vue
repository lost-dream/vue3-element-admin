<template>
  <div :class="['app-wrapper', classObj]">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar :class="classObj" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, watch } from 'vue'
import AppMain from './components/AppMain.vue'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import Settings from './components/Settings.vue'
import { useStore } from '@/store'
import { throttle } from 'lodash'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagsView,
    RightPanel,
    Settings
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const WIDTH = 993 // refer to Bootstrap's responsive design

    const computedValue = {
      sidebar: computed(() => store.state.app.sidebar),
      device: computed(() => store.state.app.device),
      showSettings: computed(() => store.state.settings.showSettings),
      needTagsView: computed(() => store.state.settings.tagsView),
      fixedHeader: computed(() => store.state.settings.fixedHeader)
    }

    const classObj = computed(() => {
      return {
        hideSidebar: !computedValue.sidebar.value.opened,
        openSidebar: computedValue.sidebar.value.opened,
        withoutAnimation: computedValue.sidebar.value.withoutAnimation,
        mobile: computedValue.device.value === 'mobile'
      }
    })

    const isMobile = (): boolean => document.body.getBoundingClientRect().width < WIDTH

    watch(
      () => route,
      () => {
        if (computedValue.device.value === 'mobile' && computedValue.sidebar.value.opened) {
          store.dispatch('app/closeSideBar', { withoutAnimation: false })
        }
      }
    )

    function handleResize() {
      if (!document.hidden) {
        store.dispatch('app/toggleDevice', isMobile() ? 'mobile' : 'desktop')
        if (isMobile()) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }

    function handleClickOutside() {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    onBeforeMount(() => {
      window.addEventListener('resize', handleResize)
    })

    onMounted(() => {
      if (isMobile()) {
        store.dispatch('app/toggleDevice', 'mobile')
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      ...computedValue,
      classObj,
      isMobile,
      handleClickOutside
    }
  }
})
</script>

<style lang="scss">
.app-wrapper {
  position: relative;
  @include cube();
  .main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: $sideBarWidth;
    position: relative;
  }
  &.hideSidebar {
    .main-container {
      margin-left: 54px;
    }
  }

  &.mobile {
    .main-container {
      margin-left: 0px;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
}
</style>
