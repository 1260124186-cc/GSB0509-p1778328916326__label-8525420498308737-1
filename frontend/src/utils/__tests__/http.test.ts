import { describe, it, expect, vi, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'

describe('apiClient', () => {
  let mock: MockAdapter

  beforeEach(async () => {
    vi.resetModules()
  })

  it('should use default baseURL when env var is not set', async () => {
    import.meta.env.VITE_API_BASE_URL = ''
    const { default: apiClient } = await import('../http')
    mock = new MockAdapter(apiClient)
    expect(apiClient.defaults.baseURL).toBe('https://jsonplaceholder.typicode.com')
  })

  it('should use custom baseURL when env var is set', async () => {
    import.meta.env.VITE_API_BASE_URL = 'https://custom-api.com'
    const { default: apiClient } = await import('../http')
    mock = new MockAdapter(apiClient)
    expect(apiClient.defaults.baseURL).toBe('https://custom-api.com')
  })

  it('should return response data on success', async () => {
    const { default: apiClient } = await import('../http')
    mock = new MockAdapter(apiClient)
    const mockData = { id: 1, title: 'Test Todo' }
    mock.onGet('/todos/1').reply(200, mockData)

    const result = await apiClient.get('/todos/1')
    expect(result).toEqual(mockData)
  })

  it('should handle error response with message', async () => {
    const { default: apiClient } = await import('../http')
    mock = new MockAdapter(apiClient)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mock.onGet('/todos/999').reply(404, { message: 'Not Found' })

    await expect(apiClient.get('/todos/999')).rejects.toThrow()
    expect(consoleErrorSpy).toHaveBeenCalledWith('[API Error]:', 'Not Found')
    consoleErrorSpy.mockRestore()
  })

  it('should handle error response without message', async () => {
    const { default: apiClient } = await import('../http')
    mock = new MockAdapter(apiClient)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mock.onGet('/todos/999').reply(500)

    await expect(apiClient.get('/todos/999')).rejects.toThrow()
    expect(consoleErrorSpy).toHaveBeenCalledWith('[API Error]:', '网络错误')
    consoleErrorSpy.mockRestore()
  })

  it('should handle network error', async () => {
    const { default: apiClient } = await import('../http')
    mock = new MockAdapter(apiClient)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mock.onGet('/todos/999').networkError()

    await expect(apiClient.get('/todos/999')).rejects.toThrow()
    expect(consoleErrorSpy).toHaveBeenCalledWith('[API Error]:', '网络错误')
    consoleErrorSpy.mockRestore()
  })
})
