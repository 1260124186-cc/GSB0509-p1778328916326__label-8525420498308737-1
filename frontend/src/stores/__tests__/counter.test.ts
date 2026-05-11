import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../counter'

describe('useCounterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with count 0', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('should increment count', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
    store.increment()
    expect(store.count).toBe(2)
  })

  it('should have correct initial state', () => {
    const store = useCounterStore()
    expect(store.$state).toEqual({ count: 0 })
  })
})
