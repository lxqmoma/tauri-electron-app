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

export class WebBridge implements IPlatformBridge {
  readonly platform: PlatformType = 'web'

  file: IFileService = {
    async read(_path: string): Promise<string> {
      console.warn('Web environment does not support file system access directly.')
      return ''
    },
    async write(_path: string, _content: string): Promise<void> {
      console.warn('Web environment does not support file system access directly.')
    },
    async exists(_path: string): Promise<boolean> {
      return false
    },
    async openDialog(_options?: FileDialogOptions): Promise<string | string[] | null> {
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        // Web端模拟，仅用于演示
        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement).files
          if (files && files.length > 0) {
            // Web端通常不能获取完整路径，这里只是模拟
            resolve(files[0].name)
          }
          else {
            resolve(null)
          }
        }
        input.click()
      })
    },
    async saveDialog(_options?: SaveDialogOptions): Promise<string | null> {
      console.warn('Web environment save dialog not fully supported.')
      return null
    },
  }

  dialog: IDialogService = {
    async message(options: MessageOptions): Promise<void> {
      // eslint-disable-next-line no-alert
      alert(`${options.title ? `${options.title}\n` : ''}${options.message}`)
    },
    async confirm(options: ConfirmOptions): Promise<boolean> {
      // eslint-disable-next-line no-alert
      return confirm(`${options.title ? `${options.title}\n` : ''}${options.message}`)
    },
  }

  storage: IStorageService = {
    async get<T>(key: string): Promise<T | null> {
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
      return '1.0.0'
    },
    async getPlatformInfo() {
      return {
        name: 'web',
        version: navigator.userAgent,
        os: navigator.platform,
        arch: 'unknown',
      }
    },
    async openExternal(url: string): Promise<void> {
      window.open(url, '_blank')
    },
  }
}
