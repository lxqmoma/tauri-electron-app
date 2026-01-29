/**
 * 平台桥接类型定义
 */

export type PlatformType = 'web' | 'electron' | 'tauri'

export interface FileDialogOptions {
  title?: string
  defaultPath?: string
  filters?: {
    name: string
    extensions: string[]
  }[]
  multiple?: boolean
  directory?: boolean
}

export interface SaveDialogOptions {
  title?: string
  defaultPath?: string
  filters?: {
    name: string
    extensions: string[]
  }[]
}

export interface MessageOptions {
  title?: string
  message: string
  type?: 'info' | 'warning' | 'error'
}

export interface ConfirmOptions extends MessageOptions {
  okLabel?: string
  cancelLabel?: string
}

export interface PlatformInfo {
  name: PlatformType
  version: string
  os: string
  arch: string
}

export interface IFileService {
  read: (path: string) => Promise<string>
  write: (path: string, content: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
  openDialog: (options?: FileDialogOptions) => Promise<string | string[] | null>
  saveDialog: (options?: SaveDialogOptions) => Promise<string | null>
}

export interface IDialogService {
  message: (options: MessageOptions) => Promise<void>
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export interface IStorageService {
  get: <T>(key: string) => Promise<T | null>
  set: <T>(key: string, value: T) => Promise<void>
  remove: (key: string) => Promise<void>
  clear: () => Promise<void>
}

export interface ISystemService {
  getAppVersion: () => Promise<string>
  getPlatformInfo: () => Promise<PlatformInfo>
  openExternal: (url: string) => Promise<void>
}

export interface IPlatformBridge {
  readonly platform: PlatformType
  file: IFileService
  dialog: IDialogService
  storage: IStorageService
  system: ISystemService
}
