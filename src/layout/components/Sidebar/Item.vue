<template>
  <template v-if="icon">
    <i v-if="icon.includes('el-icon')" :class="['sub-el-icon', icon]"></i>
    <svg-icon v-else :icon-class="icon"></svg-icon>
  </template>
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
