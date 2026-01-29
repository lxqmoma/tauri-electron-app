import type {
  ConfirmOptions,
  FileDialogOptions,
  IDialogService,
  IFileService,
  IPlatformBridge,
  IStorageService,
  ISystemService,
  MessageOptions,
  PlatformType,
  SaveDialogOptions,
} from '../types'

// Electron IPC 接口定义（需要在 electron preload 中实现）
interface IElectronAPI {
  ipcRenderer: {
    invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
    send: (channel: string, ...args: unknown[]) => void
    on: (channel: string, listener: (event: unknown, ...args: unknown[]) => void) => void
    removeListener: (channel: string, listener: (...args: unknown[]) => void) => void
  }
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}

export class ElectronBridge implements IPlatformBridge {
  readonly platform: PlatformType = 'electron'

  file: IFileService = {
    async read(path: string): Promise<string> {
      return (await window.electron.ipcRenderer.invoke('file:read', path)) as string
    },
    async write(path: string, content: string): Promise<void> {
      await window.electron.ipcRenderer.invoke('file:write', path, content)
    },
    async exists(path: string): Promise<boolean> {
      return (await window.electron.ipcRenderer.invoke('file:exists', path)) as boolean
    },
    async openDialog(options?: FileDialogOptions): Promise<string | string[] | null> {
      return (await window.electron.ipcRenderer.invoke('dialog:open', options)) as string | string[] | null
    },
    async saveDialog(options?: SaveDialogOptions): Promise<string | null> {
      return (await window.electron.ipcRenderer.invoke('dialog:save', options)) as string | null
    },
  }

  dialog: IDialogService = {
    async message(options: MessageOptions): Promise<void> {
      await window.electron.ipcRenderer.invoke('dialog:message', options)
    },
    async confirm(options: ConfirmOptions): Promise<boolean> {
      return (await window.electron.ipcRenderer.invoke('dialog:confirm', options)) as boolean
    },
  }

  storage: IStorageService = {
    async get<T>(key: string): Promise<T | null> {
      // Electron 环境也可以复用 localStorage，或者使用 electron-store
      // 这里为了简单，先使用 localStorage，生产环境建议走 IPC 存本地文件
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : null
    },
    async set<T>(key: string, value: T): Promise<void> {
      localStorage.setItem(key, JSON.stringify(value))
    },
    async remove(key: string): Promise<void> {
      localStorage.removeItem(key)
    },
    async clear(): Promise<void> {
      localStorage.clear()
    },
  }

  system: ISystemService = {
    async getAppVersion(): Promise<string> {
      return (await window.electron.ipcRenderer.invoke('app:version')) as string
    },
    async getPlatformInfo() {
      return (await window.electron.ipcRenderer.invoke('app:info')) as any
    },
    async openExternal(url: string): Promise<void> {
      await window.electron.ipcRenderer.invoke('shell:open', url)
    },
  }
}
