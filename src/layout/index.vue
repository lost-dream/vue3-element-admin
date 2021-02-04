<template>
  <div :class="['app-wrapper', classObj]">
    <sidebar />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <!-- <right-panel v-if="showSettings">
      <settings />
    </right-panel> -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onBeforeUnmount, onMounted, watch } from 'vue'
import AppMain from '@/layout/components/AppMain.vue'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import Navbar from '@/layout/components/navbar.vue'
import TagsView from '@/layout/components/TagsView/index.vue'
import LayoutTags from '@/layout/components/tags.vue'
import LayoutTheme from '@/layout/components/theme.vue'
import { useStore } from '@/store'
import { throttle } from 'lodash'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    Navbar,
    TagsView
    // LayoutTags,
    // LayoutTheme
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
        hideSidebar: computedValue.sidebar.value.opened,
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
          store.dispatch('app/closeSidebar', { withoutAnimation: false })
        }
      }
    )

    function handleResize() {
      if (!document.hidden) {
        store.dispatch('app/toggleDevice', isMobile() ? 'mobile' : 'desktop')
        if (isMobile()) {
          store.dispatch('app/closeSidebar', { withoutAnimation: true })
        }
      }
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
      isMobile
    }
  }
})
</script>

<style lang="scss">
.app-wrapper {
  position: relative;
  @include cube();
}
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}
</style>
