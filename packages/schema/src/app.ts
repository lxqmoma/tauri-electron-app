/**
 * UApp 配置相关类型和验证器
 */
import { z } from 'zod'

/**
 * UApp 配置项类型
 */
export type UAppValueType = 'string' | 'number' | 'boolean' | 'array' | 'object'

/**
 * UApp 配置项
 */
export interface UAppConfigItem {
  key: string
  value: unknown
  type: UAppValueType
  description?: string
  required?: boolean
  children?: UAppConfigItem[]
}

/**
 * UApp 配置文件
 */
export interface UAppConfigFile {
  name: string
  path: string
  version: string
  description?: string
  items: UAppConfigItem[]
  createdAt: string
  updatedAt: string
}

/**
 * UApp 项目
 */
export interface UAppProject {
  id: string
  name: string
  description?: string
  configs: UAppConfigFile[]
  createdAt: string
  updatedAt: string
}

/**
 * UApp 配置项验证器
 */
export const UAppConfigItemSchema: z.ZodType<UAppConfigItem> = z.lazy(() =>
  z.object({
    key: z.string().min(1, '配置键不能为空'),
    value: z.unknown(),
    type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
    description: z.string().optional(),
    required: z.boolean().optional(),
    children: z.array(UAppConfigItemSchema).optional(),
  }),
)

/**
 * UApp 配置文件验证器
 */
export const UAppConfigFileSchema = z.object({
  name: z.string().min(1, '文件名不能为空'),
  path: z.string().min(1, '文件路径不能为空'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, '版本号格式应为 x.x.x'),
  description: z.string().optional(),
  items: z.array(UAppConfigItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * UApp 项目验证器
 */
export const UAppProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, '项目名不能为空'),
  description: z.string().optional(),
  configs: z.array(UAppConfigFileSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

/**
 * 验证 UApp 配置
 */
export function validateUAppConfig(data: unknown): UAppConfigFile {
  return UAppConfigFileSchema.parse(data)
}

/**
 * 安全验证 UApp 配置
 */
export function safeParseUAppConfig(data: unknown) {
  return UAppConfigFileSchema.safeParse(data)
}
