/**
 * Zod 验证器
 */
import { z } from 'zod'

/**
 * 通用验证规则
 */
export const requiredString = z.string().min(1, '此字段为必填项')
export const optionalString = z.string().optional()
export const email = z.string().email('请输入有效的邮箱地址')
export const phone = z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
export const url = z.string().url('请输入有效的 URL')
export const positiveNumber = z.number().positive('请输入正数')
export const nonNegativeNumber = z.number().nonnegative('请输入非负数')

/**
 * API 响应验证
 */
export const apiResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.unknown(),
  success: z.boolean(),
})

/**
 * 分页参数验证
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
})

/**
 * 用户信息验证
 */
export const userInfoSchema = z.object({
  id: z.string(),
  username: z.string().min(2, '用户名至少2个字符'),
  nickname: z.string().optional(),
  avatar: z.string().url().optional(),
  email: z.string().email().optional(),
  roles: z.array(z.string()).optional(),
})

/**
 * 创建可选字段的 schema
 */
export function createPartialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.partial()
}

/**
 * 重新导出 zod
 */
export { z }
export type { ZodError, ZodSchema, ZodType } from 'zod'
