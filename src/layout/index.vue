<template>
  <sidebar />

  <div :class="{ hasTagsView: needTagsView }" class="main-container">
    <!-- <div :class="{ 'fixed-header': fixedHeader }">
      <navbar />
      <tags-view v-if="needTagsView" />
    </div> -->
    <layout-content />
    <!-- <right-panel v-if="showSettings">
      <settings />
    </right-panel> -->
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
    Sidebar
    // LayoutNavbar,
    // LayoutTags,
    // LayoutTheme
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
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}
</style>
