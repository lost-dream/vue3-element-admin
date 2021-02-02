<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts">
import { isExternal as IsExternal } from '@/utils/validate'
import { computed } from 'vue'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isExternal = computed(() => IsExternal(props.to))
    const type = computed(() => {
      if (isExternal.value) {
        return 'a'
      }
      return 'router-link'
    })

    const linkProps = (to: string) => {
      if (isExternal.value) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }

    return {
      isExternal,
      type,
      linkProps
    }
  }
}
</script>
