import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import apiClient from '../src/utils/http'
import { fetchTodo, type Todo } from '../src/api/demo'

vi.mock('../src/utils/http')

describe('fetchTodo API', () => {
  const mockTodo: Todo = {
    userId: 1,
    id: 42,
    title: 'Test Todo',
    completed: false,
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch a todo by id successfully', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(mockTodo)

    const result = await fetchTodo(42)

    expect(result).toEqual(mockTodo)
    expect(apiClient.get).toHaveBeenCalledWith('/todos/42')
  })

  it('should handle different todo ids', async () => {
    const todo2: Todo = {
      userId: 2,
      id: 99,
      title: 'Another Todo',
      completed: true,
    }
    vi.mocked(apiClient.get).mockResolvedValue(todo2)

    const result = await fetchTodo(99)

    expect(result).toEqual(todo2)
    expect(apiClient.get).toHaveBeenCalledWith('/todos/99')
  })

  it('should reject with error when API call fails', async () => {
    const testError = new Error('Network error')
    vi.mocked(apiClient.get).mockRejectedValue(testError)

    await expect(fetchTodo(1)).rejects.toThrow('Network error')
    expect(apiClient.get).toHaveBeenCalledWith('/todos/1')
  })

  it('should return correct Todo type structure', async () => {
    const completeTodo: Todo = {
      userId: 3,
      id: 100,
      title: 'Complete task',
      completed: true,
    }
    vi.mocked(apiClient.get).mockResolvedValue(completeTodo)

    const result = await fetchTodo(100)

    expect(result).toHaveProperty('userId', 3)
    expect(result).toHaveProperty('id', 100)
    expect(result).toHaveProperty('title', 'Complete task')
    expect(result).toHaveProperty('completed', true)
    expect(typeof result.userId).toBe('number')
    expect(typeof result.id).toBe('number')
    expect(typeof result.title).toBe('string')
    expect(typeof result.completed).toBe('boolean')
  })
})
