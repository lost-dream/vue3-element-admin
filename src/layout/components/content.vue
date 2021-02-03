<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    const route = useRoute()
    const store = useStore()

    const key = computed(() => route.path)
    // const cachedViews = store.state.tagsView.cachedViews

    return {
      key,
      cachedViews: []
    }
  }
})
</script>
