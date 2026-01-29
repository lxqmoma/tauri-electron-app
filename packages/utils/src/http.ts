import type { FetchOptions } from 'ofetch'
/**
 * HTTP 请求工具
 * 基于 ofetch 封装
 */
import { ofetch } from 'ofetch'

export interface RequestConfig extends FetchOptions {
  baseURL?: string
  showError?: boolean
}

const defaultConfig: RequestConfig = {
  baseURL: '',
  timeout: 30000,
  showError: true,
}

/**
 * 创建请求实例
 */
export function createRequest(config: RequestConfig = {}) {
  const mergedConfig = { ...defaultConfig, ...config }

  const request = ofetch.create({
    baseURL: mergedConfig.baseURL,
    timeout: mergedConfig.timeout,
    onRequest({ options }) {
      // 请求拦截器 - 添加通用 headers
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
      }
    },
    onRequestError({ error }) {
      // 请求错误处理
      console.error('[Request Error]', error)
    },
    onResponse({ response }) {
      // 响应拦截器
      return response._data
    },
    onResponseError({ response }) {
      // 响应错误处理
      const status = response.status
      const message = response._data?.message || `HTTP Error: ${status}`
      console.error('[Response Error]', message)
      throw new Error(message)
    },
  })

  return request
}

/**
 * 默认请求实例
 */
export const http = createRequest()

/**
 * GET 请求
 */
export async function get<T>(url: string, params?: Record<string, unknown>, config?: RequestConfig): Promise<T> {
  return http<T>(url, {
    method: 'GET',
    query: params,
    ...config,
  })
}

/**
 * POST 请求
 */
export async function post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return http<T>(url, {
    method: 'POST',
    body: data,
    ...config,
  })
}

/**
 * PUT 请求
 */
export async function put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
  return http<T>(url, {
    method: 'PUT',
    body: data,
    ...config,
  })
}

/**
 * DELETE 请求
 */
export async function del<T>(url: string, config?: RequestConfig): Promise<T> {
  return http<T>(url, {
    method: 'DELETE',
    ...config,
  })
}
