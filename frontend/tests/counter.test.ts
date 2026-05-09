import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial count of 0', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
  })

  it('should increment count by 1 when increment is called', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })

  it('should increment count multiple times', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    store.increment()
    expect(store.count).toBe(3)
  })

  it('should maintain separate state for different store instances', () => {
    const store1 = useCounterStore()
    store1.increment()
    expect(store1.count).toBe(1)

    setActivePinia(createPinia())
    const store2 = useCounterStore()
    expect(store2.count).toBe(0)
  })
})
