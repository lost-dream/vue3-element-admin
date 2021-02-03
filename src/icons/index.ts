import SvgIcon from '@/components/SvgIcon' // svg component
import { App } from 'vue'

export default function icons(app: App) {
  app.component('svg-icon', SvgIcon)
  const req = require.context('./svg', false, /\.svg$/)
  const requireAll = (requireContext: any) => requireContext.keys().map(requireContext)

  requireAll(req)
}
