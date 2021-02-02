export type Size = 'medium' | 'default' | 'small' | 'mini'
export default interface AppState {
  sidebar: {
    opened: boolean | undefined
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'
  size: Size
}
