import type { ConfigType, Dayjs, ManipulateType, OpUnitType } from 'dayjs'
/**
 * 日期时间工具
 * 基于 dayjs 封装
 */
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'

// 扩展插件
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)

// 设置中文
dayjs.locale('zh-cn')

/**
 * 默认日期格式
 */
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const TIME_FORMAT = 'HH:mm:ss'

/**
 * 格式化日期
 */
export function formatDate(date?: ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date?: ConfigType, format = DATETIME_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 格式化时间
 */
export function formatTime(date?: ConfigType, format = TIME_FORMAT): string {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间（如：3分钟前）
 */
export function fromNow(date: ConfigType): string {
  return dayjs(date).fromNow()
}

/**
 * 获取到现在的相对时间
 */
export function toNow(date: ConfigType): string {
  return dayjs(date).toNow()
}

/**
 * 日期加减
 */
export function addTime(date: ConfigType, value: number, unit: ManipulateType): Dayjs {
  return dayjs(date).add(value, unit)
}

/**
 * 日期减
 */
export function subtractTime(date: ConfigType, value: number, unit: ManipulateType): Dayjs {
  return dayjs(date).subtract(value, unit)
}

/**
 * 获取两个日期之间的差值
 */
export function diff(date1: ConfigType, date2: ConfigType, unit: OpUnitType = 'day'): number {
  return dayjs(date1).diff(dayjs(date2), unit)
}

/**
 * 判断日期是否在某个日期之前
 */
export function isBefore(date1: ConfigType, date2: ConfigType): boolean {
  return dayjs(date1).isBefore(dayjs(date2))
}

/**
 * 判断日期是否在某个日期之后
 */
export function isAfter(date1: ConfigType, date2: ConfigType): boolean {
  return dayjs(date1).isAfter(dayjs(date2))
}

/**
 * 判断两个日期是否相同
 */
export function isSame(date1: ConfigType, date2: ConfigType, unit: OpUnitType = 'day'): boolean {
  return dayjs(date1).isSame(dayjs(date2), unit)
}

/**
 * 获取当前时间戳
 */
export function now(): number {
  return dayjs().valueOf()
}

/**
 * 解析日期
 */
export function parseDate(date: ConfigType): Dayjs {
  return dayjs(date)
}

/**
 * 导出 dayjs 实例供高级用法
 */
export { dayjs }
