<template>
  <div class="icons-container">
    <aside><a href="javaScript:void(0);">Add and use </a></aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Svg Icons">
        <div class="grid">
          <div
            v-for="item of svgIcons"
            :key="item"
            @click="handleClipboard(generateIconCode(item), $event)"
          >
            <el-tooltip placement="top">
              <template #content>
                <div>
                  {{ generateIconCode(item) }}
                </div>
              </template>

              <div class="icon-item">
                <svg-icon :icon-class="item" class-name="disabled" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="ElementUI Icons">
        <div class="grid">
          <div
            v-for="item of elementIcons"
            :key="item"
            @click="handleClipboard(generateElementIconCode(item), $event)"
          >
            <el-tooltip placement="top">
              <template #content>
                <div>
                  {{ generateElementIconCode(item) }}
                </div>
              </template>

              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'
import { reactive, toRefs } from 'vue'

export default {
  name: 'Icons',
  setup() {
    const state = reactive({
      svgIcons,
      elementIcons
    })

    const methods = {
      generateIconCode(symbol: string) {
        return `<svg-icon icon-class="${symbol}" />`
      },
      generateElementIconCode(symbol: string) {
        return `<i class="el-icon-${symbol}" />`
      },
      handleClipboard(text: string, event: MouseEvent) {
        clipboard(text, event)
      }
    }

    return {
      ...toRefs(state),
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
