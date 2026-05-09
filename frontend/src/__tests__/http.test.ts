import { describe, it, expect, vi } from 'vitest'

const { interceptorHandlers, createFn } = vi.hoisted(() => {
  const interceptorHandlers: Array<{ success: Function; error: Function }> = []
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: {
        use: (successCb: Function, errorCb: Function) => {
          interceptorHandlers.push({ success: successCb, error: errorCb })
        },
      },
    },
  }
  const createFn = vi.fn(() => mockInstance)
  return { interceptorHandlers, createFn }
})

vi.mock('axios', () => ({
  default: {
    create: createFn,
  },
}))

import axios from 'axios'
import apiClient from '../utils/http'

describe('http.ts', () => {
  it('creates axios instance with correct config', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  })

  it('uses baseURL from environment', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
      })
    )
  })

  it('registers response interceptor', () => {
    expect(interceptorHandlers.length).toBeGreaterThan(0)
  })

  it('response success interceptor returns response.data', () => {
    const { success } = interceptorHandlers[0]
    const mockResponse = { data: { id: 1 }, status: 200 }
    expect(success(mockResponse)).toEqual({ id: 1 })
  })

  it('response error interceptor extracts message from error.response.data.message', async () => {
    const { error: errorHandler } = interceptorHandlers[0]
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = {
      response: { data: { message: 'Server Error' } },
    }
    await expect(errorHandler(error)).rejects.toEqual(error)
    expect(consoleSpy).toHaveBeenCalledWith('[API Error]:', 'Server Error')
    consoleSpy.mockRestore()
  })

  it('response error interceptor falls back to "网络错误" when no response', async () => {
    const { error: errorHandler } = interceptorHandlers[0]
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = {}
    await expect(errorHandler(error)).rejects.toEqual(error)
    expect(consoleSpy).toHaveBeenCalledWith('[API Error]:', '网络错误')
    consoleSpy.mockRestore()
  })

  it('exports the created axios instance', () => {
    expect(apiClient).toBeDefined()
    expect(apiClient.get).toBeDefined()
    expect(apiClient.interceptors).toBeDefined()
  })
})
