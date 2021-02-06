<template>
  <div class="keyboard">
    {{ state.msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'keyboard',
  setup(props, ctx) {
    const state = {
      msg: 'keyboard'
    }

    return {
      state
    }
  }
})
</script>

<style scoped lang="scss">
.keyboard {
}
</style>
