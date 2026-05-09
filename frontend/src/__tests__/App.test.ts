import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

const { mockFetchTodo } = vi.hoisted(() => ({
  mockFetchTodo: vi.fn().mockResolvedValue({ userId: 1, id: 1, title: 'Test', completed: false }),
}))

vi.mock('../api/demo', () => ({
  fetchTodo: (...args: unknown[]) => mockFetchTodo(...args),
}))

import App from '../App.vue'
import HomeView from '../views/HomeView.vue'

describe('App.vue', () => {
  it('renders navbar with brand text', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'home', component: HomeView }],
    })
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.brand').text()).toBe('Vue 模板')
  })

  it('contains RouterView component', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'home', component: HomeView }],
    })
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    expect(wrapper.find('.main-content').exists()).toBe(true)
  })
})
