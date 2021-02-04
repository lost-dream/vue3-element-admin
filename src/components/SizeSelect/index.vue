<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size === item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { computed, defineComponent, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Size } from '@/store/modules/app/interface'

type Option = Array<{ label: string; value: Size }>

export default defineComponent({
  name: 'fontSizeChange',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const sizeOptions: Option = [
      { label: 'Default', value: 'default' },
      { label: 'Medium', value: 'medium' },
      { label: 'Small', value: 'small' },
      { label: 'Mini', value: 'mini' }
    ]

    const size = computed(() => store.getters.size)

    function refreshView() {
      // In order to make the cached page re-rendered
      store.dispatch('tagsView/delAllCachedViews', route)

      const { fullPath } = route

      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath
        })
      })
    }

    function handleSetSize(size: Size) {
      //  $ELEMENT.size = size // TODO 怎么修改 size
      store.dispatch('app/setSize', size)
      refreshView()
      ElMessage({
        message: 'Switch Size Success',
        type: 'success'
      })
    }

    return {
      sizeOptions,
      size,
      handleSetSize,
      refreshView
    }
  }
})
</script>
