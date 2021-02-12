<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    const store = useStore()
    const cachedViews = computed(() => store.getters.cachedViews)
    return {
      cachedViews
    }
  }
})
</script>
