<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

const tagAndTagSpacing = 4 // tagAndTagSpacing

export default defineComponent({
  name: 'ScrollPane',
  emits: ['scroll'],
  setup(props, context) {
    const scrollContainer = ref()

    const _this = getCurrentInstance()

    const left = ref(0)

    const scrollWrapper = computed(() => scrollContainer?.value?.$refs?.wrap)

    function handleScroll(e: any) {
      if (!scrollWrapper.value) return
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      scrollWrapper.value.scrollLeft = scrollWrapper.value.scrollLeft + eventDelta / 4
    }

    function emitScroll() {
      context.emit('scroll')
    }

    function moveToTarget(currentTag: any) {
      const $container = scrollContainer.value.$el
      const $containerWidth = $container.offsetWidth
      const $scrollWrapper = scrollWrapper

      const tagList: any = (_this?.parent?.proxy as any).tagList

      let firstTag = null
      let lastTag = null

      console.log('tagList :>> ', tagList)

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      if (firstTag === currentTag) {
        $scrollWrapper.value.scrollLeft = 0
      } else if (lastTag === currentTag) {
        $scrollWrapper.value.scrollLeft = $scrollWrapper.value.scrollWidth - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex((item: any) => item === currentTag)
        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > $scrollWrapper.value.scrollLeft + $containerWidth) {
          $scrollWrapper.value.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.value.scrollLeft) {
          $scrollWrapper.value.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }

    onMounted(() => {
      scrollWrapper.value.addEventListener('scroll', emitScroll, true)
      console.log('scrollContainer.value.$parent.$refs.tag :>> ')
    })

    return {
      left,
      scrollContainer,
      handleScroll,
      scrollWrapper,
      moveToTarget
    }
  }
})
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
