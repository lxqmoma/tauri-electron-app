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
import { getTauriVersion, getVersion } from '@tauri-apps/api/app'
import { ask, message, open, save } from '@tauri-apps/plugin-dialog'
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { openUrl } from '@tauri-apps/plugin-opener'
import { arch, platform } from '@tauri-apps/plugin-os'

export class TauriBridge implements IPlatformBridge {
  readonly platform: PlatformType = 'tauri'

  file: IFileService = {
    async read(path: string): Promise<string> {
      return await readTextFile(path)
    },
    async write(path: string, content: string): Promise<void> {
      await writeTextFile(path, content)
    },
    async exists(path: string): Promise<boolean> {
      return await exists(path)
    },
    async openDialog(options?: FileDialogOptions): Promise<string | string[] | null> {
      const selected = await open({
        multiple: options?.multiple ?? false,
        directory: options?.directory ?? false,
        filters: options?.filters,
        defaultPath: options?.defaultPath,
      })

      if (selected === null)
        return null
      // 这里的类型转换取决于 multiple 选项
      return selected as string | string[]
    },
    async saveDialog(options?: SaveDialogOptions): Promise<string | null> {
      return await save({
        defaultPath: options?.defaultPath,
        filters: options?.filters,
      })
    },
  }

  dialog: IDialogService = {
    async message(options: MessageOptions): Promise<void> {
      await message(options.message, {
        title: options.title,
        kind: options.type === 'error' ? 'error' : options.type === 'warning' ? 'warning' : 'info',
      })
    },
    async confirm(options: ConfirmOptions): Promise<boolean> {
      return await ask(options.message, {
        title: options.title,
        kind: options.type === 'error' ? 'error' : options.type === 'warning' ? 'warning' : 'info',
        okLabel: options.okLabel || 'Yes',
        cancelLabel: options.cancelLabel || 'No',
      })
    },
  }

  storage: IStorageService = {
    async get<T>(key: string): Promise<T | null> {
      // Tauri 也可以用 tauri-plugin-store，这里简化用 localStorage
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
      return await getVersion()
    },
    async getPlatformInfo() {
      return {
        name: 'tauri',
        version: await getTauriVersion(),
        os: await platform(),
        arch: await arch(),
      }
    },
    async openExternal(url: string): Promise<void> {
      await openUrl(url)
    },
  }
}
