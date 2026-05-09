import { describe, it, expect } from 'vitest'
import router from '../router'

describe('router.ts', () => {
  it('has a home route at path /', () => {
    const homeRoute = router.getRoutes().find((r) => r.name === 'home')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
  })

  it('has exactly one route', () => {
    const routes = router.getRoutes()
    expect(routes).toHaveLength(1)
  })

  it('uses createWebHistory', () => {
    expect(router.options.history).toBeDefined()
  })

  it('home route resolves to HomeView component', () => {
    const homeRoute = router.getRoutes().find((r) => r.name === 'home')
    expect(homeRoute?.components?.default).toBeDefined()
  })
})
