import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTodo } from '../api/demo'

vi.mock('../utils/http', () => ({
  default: {
    get: vi.fn(),
  },
}))

import apiClient from '../utils/http'

describe('api/demo.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchTodo calls apiClient.get with correct path', async () => {
    const mockTodo = { userId: 1, id: 1, title: 'Test', completed: false }
    vi.mocked(apiClient.get).mockResolvedValue(mockTodo)
    const result = await fetchTodo(1)
    expect(apiClient.get).toHaveBeenCalledWith('/todos/1')
    expect(result).toEqual(mockTodo)
  })

  it('fetchTodo passes different id values', async () => {
    const mockTodo = { userId: 2, id: 42, title: 'Another', completed: true }
    vi.mocked(apiClient.get).mockResolvedValue(mockTodo)
    const result = await fetchTodo(42)
    expect(apiClient.get).toHaveBeenCalledWith('/todos/42')
    expect(result).toEqual(mockTodo)
  })

  it('fetchTodo propagates errors from apiClient', async () => {
    const error = new Error('Network Error')
    vi.mocked(apiClient.get).mockRejectedValue(error)
    await expect(fetchTodo(1)).rejects.toThrow('Network Error')
  })
})
