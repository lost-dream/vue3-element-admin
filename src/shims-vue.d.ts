/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/*'
declare module './modules*'
declare module '@scss/*'
declare module 'clipboard'
declare module 'path-to-regexp'
declare module 'screenfull' // 只想加上一个键值: isFullscreen: boolean,怎么写