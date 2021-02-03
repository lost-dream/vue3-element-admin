import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

export default function handleClipboard(text: string, event: any) {
  const clipboard = new Clipboard(event.target, {
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
}
