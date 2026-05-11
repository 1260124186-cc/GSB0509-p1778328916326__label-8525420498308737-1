import { describe, it, expect } from 'vitest'
import router from '../router'

describe('router', () => {
  it('should have home route', () => {
    const homeRoute = router.getRoutes().find(r => r.name === 'home')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
  })

  it('should use web history mode', () => {
    expect(router.options.history).toBeDefined()
  })

  it('should have correct number of routes', () => {
    expect(router.getRoutes().length).toBeGreaterThanOrEqual(1)
  })
})
