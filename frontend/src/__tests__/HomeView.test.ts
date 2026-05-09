import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

const { mockFetchTodo } = vi.hoisted(() => ({
  mockFetchTodo: vi.fn(() => new Promise(() => {})),
}))

vi.mock('../api/demo', () => ({
  fetchTodo: (...args: unknown[]) => mockFetchTodo(...args),
}))

import HomeView from '../views/HomeView.vue'

describe('HomeView.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockFetchTodo.mockReset()
    mockFetchTodo.mockImplementation(() => new Promise(() => {}))
  })

  const mountComponent = () => {
    return mount(HomeView, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    })
  }

  it('renders loading state on mount', async () => {
    const wrapper = mountComponent()
    await nextTick()
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('加载中...')
  })

  it('displays todo data after successful fetch', async () => {
    const mockTodo = { userId: 1, id: 5, title: 'Test Todo', completed: true }
    mockFetchTodo.mockResolvedValue(mockTodo)
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.find('.loading').exists()).toBe(false)
    expect(wrapper.text()).toContain('#5')
    expect(wrapper.text()).toContain('Test Todo')
    expect(wrapper.text()).toContain('已完成')
    expect(wrapper.find('.status-dot.done').exists()).toBe(true)
  })

  it('displays pending status for incomplete todo', async () => {
    const mockTodo = { userId: 1, id: 3, title: 'Pending Todo', completed: false }
    mockFetchTodo.mockResolvedValue(mockTodo)
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.text()).toContain('待处理')
    expect(wrapper.find('.status-dot.pending').exists()).toBe(true)
  })

  it('displays error message when fetch fails', async () => {
    mockFetchTodo.mockRejectedValue(new Error('fail'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.find('.error').exists()).toBe(true)
    expect(wrapper.text()).toContain('获取数据失败，请重试。')
    expect(wrapper.find('.loading').exists()).toBe(false)
    consoleSpy.mockRestore()
  })

  it('disables refresh button while loading', async () => {
    const wrapper = mountComponent()
    await nextTick()
    const refreshBtn = wrapper.findAll('button').find((b) => b.text().includes('刷新'))
    expect(refreshBtn?.attributes('disabled')).toBeDefined()
  })

  it('clicking refresh button calls initData again', async () => {
    const mockTodo = { userId: 1, id: 1, title: 'Test', completed: false }
    mockFetchTodo.mockResolvedValue(mockTodo)
    const wrapper = mountComponent()
    await flushPromises()
    expect(mockFetchTodo).toHaveBeenCalledTimes(1)
    const refreshBtn = wrapper.findAll('button').find((b) => b.text().includes('刷新'))
    await refreshBtn?.trigger('click')
    await flushPromises()
    expect(mockFetchTodo).toHaveBeenCalledTimes(2)
  })

  it('renders counter display with initial count 0', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.counter-display').text()).toBe('0')
  })

  it('increments counter when clicking increment button', async () => {
    const wrapper = mountComponent()
    const incrementBtn = wrapper.findAll('button').find((b) => b.text().includes('增加计数'))
    await incrementBtn?.trigger('click')
    expect(wrapper.find('.counter-display').text()).toBe('1')
  })

  it('renders initial items list', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Vue 3')
    expect(wrapper.text()).toContain('TypeScript')
    expect(wrapper.text()).toContain('Vite')
  })

  it('adds a new item via button', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('.form-input')
    await input.setValue('New Item')
    const addBtn = wrapper.findAll('button').find((b) => b.text().includes('添加'))
    await addBtn?.trigger('click')
    expect(wrapper.text()).toContain('New Item')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('does not add empty or whitespace-only item', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('.form-input')
    await input.setValue('   ')
    const addBtn = wrapper.findAll('button').find((b) => b.text().includes('添加'))
    expect(addBtn?.attributes('disabled')).toBeDefined()
  })

  it('adds item on Enter key press', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('.form-input')
    await input.setValue('Enter Item')
    await input.trigger('keyup.enter')
    expect(wrapper.text()).toContain('Enter Item')
  })

  it('does not add item on Enter with empty input', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('.form-input')
    await input.setValue('')
    await input.trigger('keyup.enter')
    const items = wrapper.findAll('.item-list li:not(.empty-tip)')
    expect(items.length).toBe(3)
  })

  it('removes an item when clicking delete button', async () => {
    const wrapper = mountComponent()
    const deleteBtns = wrapper.findAll('.delete-btn')
    expect(deleteBtns.length).toBe(3)
    await deleteBtns[0].trigger('click')
    const remainingDeleteBtns = wrapper.findAll('.delete-btn')
    expect(remainingDeleteBtns.length).toBe(2)
  })

  it('shows empty tip when all items are removed', async () => {
    const wrapper = mountComponent()
    let deleteBtns = wrapper.findAll('.delete-btn')
    while (deleteBtns.length > 0) {
      await deleteBtns[0].trigger('click')
      deleteBtns = wrapper.findAll('.delete-btn')
    }
    expect(wrapper.find('.empty-tip').exists()).toBe(true)
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('renders tech stack list', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Vue 3.5+')
    expect(wrapper.text()).toContain('TypeScript 5.0+')
    expect(wrapper.text()).toContain('Pinia Store')
    expect(wrapper.text()).toContain('Vite 6.0+')
    expect(wrapper.text()).toContain('Sass / SCSS')
  })

  it('renders footer links', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('官方资源')
    expect(wrapper.find('a[href="https://vuejs.org/"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://www.typescriptlang.org/"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://pinia.vuejs.org/"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://vitejs.dev/"]').exists()).toBe(true)
    expect(wrapper.find('a[href="https://sass-lang.com/"]').exists()).toBe(true)
  })
})
