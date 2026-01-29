/**
 * 通用类型定义
 */

/**
 * API 响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  success: boolean
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * 分页响应结构
 */
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 树形结构节点
 */
export interface TreeNode<T = unknown> {
  id: string
  label: string
  children?: TreeNode<T>[]
  data?: T
  disabled?: boolean
  isLeaf?: boolean
}

/**
 * 键值对
 */
export interface KeyValue<T = string> {
  key: string
  value: T
}

/**
 * 选项结构
 */
export interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  nickname?: string
  avatar?: string
  email?: string
  roles?: string[]
}

/**
 * 应用状态
 */
export interface AppState {
  theme: 'light' | 'dark' | 'system'
  language: string
  sidebarCollapsed: boolean
}
