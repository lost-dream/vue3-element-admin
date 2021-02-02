<template>
  <i v-if="icon.includes('el-icon')" :class="['sub-el-icon', icon]"></i>
  <i v-else>svg-icon</i>
  <span>{{ title }}</span>
</template>
<script lang="ts">
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-el-icon {
  color: currentColor;
  font-size: 18px;
  width: 1em;
  height: 1em;
}
</style>
