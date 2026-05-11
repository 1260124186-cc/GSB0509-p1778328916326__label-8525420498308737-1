import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import apiClient from '../../utils/http'
import { fetchTodo, type Todo } from '../demo'

describe('fetchTodo', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(apiClient)
  })

  afterEach(() => {
    mock.restore()
  })

  it('should fetch todo by id', async () => {
    const mockTodo: Todo = {
      userId: 1,
      id: 1,
      title: 'Test Todo',
      completed: false,
    }

    mock.onGet('/todos/1').reply(200, mockTodo)

    const result = await fetchTodo(1)
    expect(result).toEqual(mockTodo)
    expect(mock.history.get.length).toBe(1)
    expect(mock.history.get[0].url).toBe('/todos/1')
  })

  it('should throw error on failed request', async () => {
    mock.onGet('/todos/999').reply(404)

    await expect(fetchTodo(999)).rejects.toThrow()
  })
})
