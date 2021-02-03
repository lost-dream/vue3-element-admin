<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" />
  </div>
</template>

<script lang="ts">
import screenfull from 'screenfull'
import { defineComponent, onBeforeUnmount, onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'

interface State {
  isFullScreen: boolean
}

export default defineComponent({
  name: 'Screenfull',
  setup() {
    const state = reactive<State>({
      isFullScreen: false
    })

    function click() {
      if (!screenfull.isEnabled) {
        ElMessage({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }

    function change() {
      state.isFullScreen = screenfull.isEnabled
    }

    function init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', change)
      }
    }
    function destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', change)
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      destroy()
    })

    return {
      ...toRefs(state),
      click,
      change,
      init,
      destroy
    }
  }
})
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
