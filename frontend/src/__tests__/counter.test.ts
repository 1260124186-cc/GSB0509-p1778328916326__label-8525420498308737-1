import { describe, it, expect, beforeEach } from 'vitest'
import { useCounterStore } from '../stores/counter'
import { createPinia, setActivePinia } from 'pinia'

describe('stores/counter.ts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with count = 0', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('increment action increases count by 1', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('increment action can be called multiple times', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    store.increment()
    expect(store.count).toBe(3)
  })
})
