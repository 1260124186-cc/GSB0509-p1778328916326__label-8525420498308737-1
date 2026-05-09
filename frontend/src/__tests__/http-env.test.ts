import { describe, it, expect, vi, beforeEach } from 'vitest'

const { interceptorHandlers, createFn } = vi.hoisted(() => {
  const interceptorHandlers: Array<{ success: Function; error: Function }> = []
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: {
        use: (s: Function, e: Function) => {
          interceptorHandlers.push({ success: s, error: e })
        },
      },
    },
  }
  const createFn = vi.fn(() => mockInstance)
  return { interceptorHandlers, createFn }
})

vi.mock('axios', () => ({
  default: { create: createFn },
}))

describe('http.ts baseURL fallback', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('falls back to default baseURL when VITE_API_BASE_URL is empty', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')

    await import('../utils/http')

    expect(createFn).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://jsonplaceholder.typicode.com',
      })
    )

    vi.unstubAllEnvs()
  })
})
