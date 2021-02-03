import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'
import ClipboardJS from 'clipboard'

export default function handleClipboard(text: string, event: MouseEvent) {
  const clipboard = new Clipboard(event.target as Element, {
    text: () => text
  })
  clipboard.on('success', () => {
    ElMessage({
      message: 'Copy successfully',
      type: 'success',
      duration: 1500
    })
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    ElMessage({
      message: 'Copy failed',
      type: 'error'
    })
    clipboard.destroy()
  })

  clipboard.onClick(event) // 类型“ClipboardJS”上不存在属性“onClick”。ts(2339)
}
