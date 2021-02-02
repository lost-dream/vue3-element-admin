<template>
  <sidebar />
  <div class="layout-main flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
    <div
      class="layout-main-navbar flex justify-between items-center h-12 shadow-sm border-b border-gray-100"
    >
      <layout-navbar />
    </div>
    <div
      class="layout-main-tags h-10 leading-10 overflow-hidden shadow text-sm text-gray-600 px-3 position"
    >
      <layout-tags />
    </div>
    <div class="layout-main-content flex-1 overflow-hidden">
      <layout-content />
    </div>
  </div>
  <div class="layout-sidebar-theme fixed right-0 top-64 z-10">
    <layout-Theme />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import LayoutContent from '@/layout/components/content.vue'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import LayoutNavbar from '@/layout/components/navbar.vue'
import LayoutTags from '@/layout/components/tags.vue'
import LayoutTheme from '@/layout/components/theme.vue'
import { useStore } from '@/store'
import { throttle } from 'lodash'

export default defineComponent({
  name: 'Layout',
  components: {
    LayoutContent,
    Sidebar,
    LayoutNavbar,
    LayoutTags,
    LayoutTheme
  },
  setup() {
    const store = useStore()
    const changeDeviceWidth = () => store.commit('layout/changeDeviceWidth')
    const changeCollapsed = () => store.commit('layout/changeCollapsed')

    store.commit('layout/changeTheme')

    onMounted(() => {
      changeDeviceWidth()
      const throttleF = async function() {
        throttle(() => changeDeviceWidth(), 300)
      }
      window.addEventListener('resize', throttleF, true)
    })
    return {
      menubar: store.state.layout.menubar,
      changeCollapsed
    }
  }
})
</script>

<style lang="scss">
.app-wrapper {
  position: relative;
  @include cube();
}
</style>
