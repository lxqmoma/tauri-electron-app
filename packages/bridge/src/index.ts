import type { IPlatformBridge } from './types'
import { ElectronBridge } from './adapters/electron'
import { WebBridge } from './adapters/web'

export { ElectronBridge } from './adapters/electron'
export { WebBridge } from './adapters/web'
export * from './types'

export function createBridge(): IPlatformBridge {
  if (typeof window !== 'undefined') {
    const win = window as any
    if (win.electron && win.electron.ipcRenderer) {
      return new ElectronBridge()
    }

    // Tauri 检测逻辑 - 注意：这里不能引用 TauriBridge，否则会破坏 Electron 构建
    // Tauri App 必须手动初始化 Bridge 并通过 provide 注入，或者我们依赖 userAgent 判断
    // 但 instantiation 必须在 app 层做。
  }
  return new WebBridge()
}

export const bridge = createBridge()
