import apiClient from '../utils/http'

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const fetchTodo = (id: number): Promise<Todo> => {
  return apiClient.get<Todo, Todo>(`/todos/${id}`)
}
