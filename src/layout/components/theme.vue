<template>
  <i
    class="el-icon-s-tools text-2xl px-2 py-1 cursor-pointer rounded-l-md"
    @click="drawer = !drawer"
  />
  <el-drawer v-model="drawer" title="主题设置">
    <el-row :gutter="20"> </el-row>
  </el-drawer>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { useStore } from '@/store'

export default defineComponent({
  name: 'LayoutTheme',
  setup() {
    const store = useStore()
    const drawer = ref(false)

    return {
      drawer,
      layout: store.state.layout
    }
  }
})
</script>
