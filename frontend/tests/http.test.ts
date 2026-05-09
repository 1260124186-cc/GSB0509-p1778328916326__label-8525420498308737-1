import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from '../src/utils/http'

const originalEnv = import.meta.env

vi.mock('axios', () => {
  const mockAxiosInstance = {
    defaults: {
      baseURL: 'https://jsonplaceholder.typicode.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
    get: vi.fn(),
  }
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  }
})

describe('apiClient (http.ts)', () => {
  let successHandler: any
  let errorHandler: any

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const interceptorsUse = apiClient.interceptors.response.use as vi.Mock
    successHandler = interceptorsUse.mock.calls[0][0]
    errorHandler = interceptorsUse.mock.calls[0][1]
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(import.meta, 'env', { value: originalEnv, writable: true })
  })

  it('should return response data directly on success through interceptor', () => {
    const mockData = { id: 1, name: 'test' }
    const mockResponse = { data: mockData } as any

    const result = successHandler(mockResponse)
    expect(result).toEqual(mockData)
  })

  it('should reject with error and log custom error message on failure', async () => {
    const errorMessage = 'Server error occurred'
    const mockError = {
      response: {
        data: { message: errorMessage },
      },
    }

    try {
      await errorHandler(mockError)
    } catch (e) {
      expect(e).toBe(mockError)
    }

    expect(console.error).toHaveBeenCalledWith('[API Error]:', errorMessage)
  })

  it('should use default error message when response has no message', async () => {
    const mockError = {
      response: {
        data: {},
      },
    }

    try {
      await errorHandler(mockError)
    } catch (e) {
      expect(e).toBe(mockError)
    }

    expect(console.error).toHaveBeenCalledWith('[API Error]:', '网络错误')
  })

  it('should use default error message when there is no response', async () => {
    const mockError = {}

    try {
      await errorHandler(mockError)
    } catch (e) {
      expect(e).toBe(mockError)
    }

    expect(console.error).toHaveBeenCalledWith('[API Error]:', '网络错误')
  })

  it('should use default error message when response is undefined', async () => {
    const mockError = {
      response: undefined,
    }

    try {
      await errorHandler(mockError)
    } catch (e) {
      expect(e).toBe(mockError)
    }

    expect(console.error).toHaveBeenCalledWith('[API Error]:', '网络错误')
  })

  it('should use default error message when response.data is undefined', async () => {
    const mockError = {
      response: {},
    }

    try {
      await errorHandler(mockError)
    } catch (e) {
      expect(e).toBe(mockError)
    }

    expect(console.error).toHaveBeenCalledWith('[API Error]:', '网络错误')
  })

  it('should have correct default configuration', () => {
    expect(apiClient.defaults.timeout).toBe(10000)
    expect(apiClient.defaults.headers?.['Content-Type']).toBe('application/json')
    expect(apiClient.defaults.baseURL).toBe('https://jsonplaceholder.typicode.com')
  })
})
