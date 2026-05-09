import { describe, expect, it } from 'vitest'
import router from '../src/router'

describe('Router', () => {
  it('should have home route configured', () => {
    const homeRoute = router.options.routes.find((r) => r.name === 'home')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
  })

  it('should use createWebHistory', () => {
    expect(router.options.history).toBeDefined()
  })

  it('should have exactly one named route', () => {
    const routes = router.options.routes.filter((r) => r.name !== undefined)
    expect(routes.length).toBe(1)
  })
})
