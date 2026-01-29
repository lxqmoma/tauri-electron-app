import type { Emitter, EventType, Handler } from 'mitt'
/**
 * 事件总线
 * 基于 mitt 封装
 */
import mitt from 'mitt'

// 定义事件类型
export interface AppEvents {
  // 通用事件
  'app:ready': void
  'app:error': Error

  // 主题切换
  'theme:change': 'light' | 'dark'

  // 用户事件
  'user:login': { userId: string, token: string }
  'user:logout': void

  // 文件事件
  'file:open': { path: string }
  'file:save': { path: string, content: string }
  'file:close': { path: string }

  // 编辑器事件
  'editor:change': { content: string }
  'editor:save': void

  // 允许自定义事件
  [key: string]: unknown
}

// 创建事件总线实例
const emitter: Emitter<AppEvents> = mitt<AppEvents>()

/**
 * 发送事件
 */
export function emit<K extends keyof AppEvents>(type: K, event: AppEvents[K]): void {
  emitter.emit(type, event)
}

/**
 * 监听事件
 */
export function on<K extends keyof AppEvents>(type: K, handler: Handler<AppEvents[K]>): void {
  emitter.on(type, handler as Handler<AppEvents[keyof AppEvents]>)
}

/**
 * 取消监听事件
 */
export function off<K extends keyof AppEvents>(type: K, handler?: Handler<AppEvents[K]>): void {
  emitter.off(type, handler as Handler<AppEvents[keyof AppEvents]>)
}

/**
 * 监听所有事件
 */
export function onAll(handler: (type: EventType, event: unknown) => void): void {
  emitter.on('*', handler)
}

/**
 * 清除所有事件监听
 */
export function clear(): void {
  emitter.all.clear()
}

/**
 * 事件总线实例
 */
export const eventBus = {
  emit,
  on,
  off,
  onAll,
  clear,
  emitter,
}

export default eventBus
