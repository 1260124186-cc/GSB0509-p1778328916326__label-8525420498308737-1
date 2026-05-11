import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import router from '../router'

describe('App.vue', () => {
  it('should render correctly', () => {
    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes: router.options.routes,
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), testRouter],
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.navbar').exists()).toBe(true)
    expect(wrapper.find('.brand').text()).toBe('Vue 模板')
    expect(wrapper.find('.main-content').exists()).toBe(true)
  })

  it('should have router view', () => {
    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes: router.options.routes,
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), testRouter],
      },
    })

    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })
})
