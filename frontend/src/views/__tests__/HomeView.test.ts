import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import MockAdapter from 'axios-mock-adapter'
import apiClient from '../../utils/http'
import HomeView from '../HomeView.vue'
import router from '../../router'

describe('HomeView', () => {
  let mock: MockAdapter
  let originalRandom: () => number

  beforeEach(() => {
    mock = new MockAdapter(apiClient)
    originalRandom = Math.random
    Math.random = () => 0.5
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    mock.restore()
    Math.random = originalRandom
    vi.restoreAllMocks()
  })

  const createWrapper = () => {
    setActivePinia(createPinia())
    const testRouter = createRouter({
      history: createMemoryHistory(),
      routes: router.options.routes,
    })
    return mount(HomeView, {
      global: {
        plugins: [createPinia(), testRouter],
      },
    })
  }

  it('should render correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.home-container').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('项目仪表盘')
  })

  it('should display counter', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.counter-display').text()).toBe('0')
  })

  it('should increment counter when button is clicked', async () => {
    const wrapper = createWrapper()
    const button = wrapper.find('.btn-primary')
    await button.trigger('click')
    expect(wrapper.find('.counter-display').text()).toBe('1')
  })

  it('should have initial items', () => {
    const wrapper = createWrapper()
    const items = wrapper.findAll('.item-list li')
    expect(items.length).toBe(3)
  })

  it('should add new item', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('.form-input')
    await input.setValue('New Item')
    await input.trigger('keyup.enter')
    const items = wrapper.findAll('.item-list li')
    expect(items.length).toBe(4)
    expect(items[3].find('span').text()).toBe('New Item')
  })

  it('should not add empty item', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('.form-input')
    await input.setValue('   ')
    const addButton = wrapper.find('.btn.small')
    await addButton.trigger('click')
    const items = wrapper.findAll('.item-list li')
    expect(items.length).toBe(3)
  })

  it('should remove item', async () => {
    const wrapper = createWrapper()
    const deleteButton = wrapper.find('.delete-btn')
    await deleteButton.trigger('click')
    const items = wrapper.findAll('.item-list li')
    expect(items.length).toBe(2)
  })

  it('should display empty tip when all items are removed', async () => {
    const wrapper = createWrapper()
    while (wrapper.findAll('.delete-btn').length > 0) {
      await wrapper.find('.delete-btn').trigger('click')
    }
    expect(wrapper.find('.empty-tip').exists()).toBe(true)
  })

  it('should display todo data after loading', async () => {
    mock.onGet('/todos/101').reply(200, {
      userId: 1,
      id: 101,
      title: 'Test Todo',
      completed: false,
    })

    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.data-content').exists()).toBe(true)
  })

  it('should display completed status correctly', async () => {
    mock.onGet('/todos/101').reply(200, {
      userId: 1,
      id: 101,
      title: 'Test Todo',
      completed: true,
    })

    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.status-dot.done').exists()).toBe(true)
  })

  it('should display pending status correctly', async () => {
    mock.onGet('/todos/101').reply(200, {
      userId: 1,
      id: 101,
      title: 'Test Todo',
      completed: false,
    })

    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.status-dot.pending').exists()).toBe(true)
  })

  it('should display error on failed request', async () => {
    mock.onGet('/todos/101').reply(500)

    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.error').exists()).toBe(true)
  })

  it('should refresh data when refresh button is clicked', async () => {
    mock.onGet('/todos/101').reply(200, {
      userId: 1,
      id: 101,
      title: 'Test Todo',
      completed: false,
    })

    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.vm.$nextTick()

    mock.reset()
    mock.onGet('/todos/101').reply(200, {
      userId: 1,
      id: 101,
      title: 'Second Todo',
      completed: true,
    })

    const refreshButton = wrapper.find('.btn-outline')
    await refreshButton.trigger('click')
    await flushPromises()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.data-content').exists()).toBe(true)
  })

  it('should disable add button when input is empty', async () => {
    const wrapper = createWrapper()
    const addButton = wrapper.find('.btn.small')
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('should enable add button when input has value', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('.form-input')
    await input.setValue('Test')
    const addButton = wrapper.find('.btn.small')
    expect(addButton.attributes('disabled')).toBeUndefined()
  })

  it('should call addItem and not add when input is only whitespace', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('.form-input')
    await input.setValue('   ')
    const addButton = wrapper.find('.btn.small')
    const initialCount = wrapper.findAll('.item-list li').length
    await addButton.trigger('click')
    const afterCount = wrapper.findAll('.item-list li').length
    expect(afterCount).toBe(initialCount)
  })

  it('should test addItem function both branches directly', async () => {
    const wrapper = createWrapper()

    wrapper.vm.newItem = '  Test Item  '
    wrapper.vm.addItem()
    expect(wrapper.vm.items).toContain('Test Item')
    expect(wrapper.vm.newItem).toBe('')

    wrapper.vm.newItem = '   '
    const beforeCount = wrapper.vm.items.length
    wrapper.vm.addItem()
    expect(wrapper.vm.items.length).toBe(beforeCount)
  })
})
