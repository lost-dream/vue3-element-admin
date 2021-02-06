<template>
  <div class="line-chart">
    {{ state.msg }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'line-chart',
  setup(props, ctx) {
    const state = {
      msg: 'line-chart'
    }

    return {
      state
    }
  }
})
</script>

<style scoped lang="scss">
.line-chart {
}
</style>
