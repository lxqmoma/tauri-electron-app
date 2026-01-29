/**
 * 本地存储工具
 * 抽象 localStorage 操作
 */

const PREFIX = 'uapp:'

/**
 * 存储选项
 */
export interface StorageOptions {
  prefix?: string
  expire?: number // 过期时间（毫秒）
}

/**
 * 存储数据结构
 */
interface StorageData<T> {
  value: T
  expire?: number
  createTime: number
}

/**
 * 设置存储
 */
export function setStorage<T>(key: string, value: T, options: StorageOptions = {}): void {
  const { prefix = PREFIX, expire } = options

  const data: StorageData<T> = {
    value,
    createTime: Date.now(),
  }

  if (expire) {
    data.expire = Date.now() + expire
  }

  try {
    localStorage.setItem(prefix + key, JSON.stringify(data))
  }
  catch (e) {
    console.error('[Storage] setStorage error:', e)
  }
}

/**
 * 获取存储
 */
export function getStorage<T>(key: string, options: StorageOptions = {}): T | null {
  const { prefix = PREFIX } = options

  try {
    const raw = localStorage.getItem(prefix + key)
    if (!raw)
      return null

    const data: StorageData<T> = JSON.parse(raw)

    // 检查是否过期
    if (data.expire && data.expire < Date.now()) {
      removeStorage(key, options)
      return null
    }

    return data.value
  }
  catch (e) {
    console.error('[Storage] getStorage error:', e)
    return null
  }
}

/**
 * 移除存储
 */
export function removeStorage(key: string, options: StorageOptions = {}): void {
  const { prefix = PREFIX } = options
  localStorage.removeItem(prefix + key)
}

/**
 * 清空所有存储
 */
export function clearStorage(options: StorageOptions = {}): void {
  const { prefix = PREFIX } = options

  const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix))
  keys.forEach(key => localStorage.removeItem(key))
}

/**
 * 获取所有存储键
 */
export function getStorageKeys(options: StorageOptions = {}): string[] {
  const { prefix = PREFIX } = options

  return Object.keys(localStorage)
    .filter(k => k.startsWith(prefix))
    .map(k => k.replace(prefix, ''))
}

/**
 * Session 存储
 */
export const sessionStorage = {
  set<T>(key: string, value: T): void {
    try {
      window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
    }
    catch (e) {
      console.error('[SessionStorage] set error:', e)
    }
  },

  get<T>(key: string): T | null {
    try {
      const raw = window.sessionStorage.getItem(PREFIX + key)
      return raw ? JSON.parse(raw) : null
    }
    catch (e) {
      console.error('[SessionStorage] get error:', e)
      return null
    }
  },

  remove(key: string): void {
    window.sessionStorage.removeItem(PREFIX + key)
  },

  clear(): void {
    const keys = Object.keys(window.sessionStorage).filter(k => k.startsWith(PREFIX))
    keys.forEach(key => window.sessionStorage.removeItem(key))
  },
}
