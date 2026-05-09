import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from '../src/App.vue'
import HomeView from '../src/views/HomeView.vue'

function createWrapper() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: HomeView }],
  })

  return mount(App, {
    global: {
      plugins: [createPinia(), router],
    },
  })
}

describe('App.vue', () => {
  it('should render the navbar with brand name', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.brand').text()).toBe('Vue 模板')
  })

  it('should render main content area', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })

  it('should render RouterView in main content', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.main-content').html()).toBeTruthy()
  })

  it('should have layout container', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.layout').exists()).toBe(true)
  })

  it('should have container class elements', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll('.container').length).toBeGreaterThan(0)
  })
})
