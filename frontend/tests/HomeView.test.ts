import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import HomeView from '../src/views/HomeView.vue'
import { fetchTodo, type Todo } from '../src/api/demo'
import { useCounterStore } from '../src/stores/counter'

vi.mock('../src/api/demo')

const mockTodo: Todo = {
  userId: 1,
  id: 1,
  title: 'Test Todo',
  completed: false,
}

function createWrapper() {
  setActivePinia(createPinia())
  return mount(HomeView, {
    global: {
      plugins: [createPinia()],
    },
  })
}

describe('HomeView.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render welcome header', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toBe('项目仪表盘')
    expect(wrapper.find('.subtitle').text()).toBe(
      'Vue 3, TypeScript, Pinia 和 Axios 的集成示例。'
    )
  })

  it('should have four cards in the grid', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    expect(wrapper.findAll('.card').length).toBe(4)
  })

  it('should display Pinia counter and increment', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    const store = useCounterStore()

    expect(wrapper.find('.counter-display').text()).toBe('0')

    await wrapper.find('.btn-primary').trigger('click')

    expect(store.count).toBe(1)
    expect(wrapper.find('.counter-display').text()).toBe('1')
  })

  it('should add items to the list', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    await wrapper.find('.form-input').setValue('New Item')
    await wrapper.find('.input-group .btn-primary').trigger('click')

    expect(wrapper.findAll('.item-list li').length).toBe(4)
    expect(wrapper.findAll('.item-list li')[3].text()).toContain('New Item')
  })

  it('should not add empty items', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    await wrapper.find('.form-input').setValue('   ')
    await wrapper.find('.input-group .btn-primary').trigger('click')

    expect(wrapper.findAll('.item-list li').length).toBe(3)
  })

  it('should handle addItem when newItem is empty', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    const initialItems = [...(wrapper.vm as any).items];
    (wrapper.vm as any).newItem = '';
    (wrapper.vm as any).addItem()

    expect((wrapper.vm as any).items).toEqual(initialItems)
  })

  it('should add item on Enter key', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    await wrapper.find('.form-input').setValue('Enter Item')
    await wrapper.find('.form-input').trigger('keyup.enter')

    expect(wrapper.findAll('.item-list li').length).toBe(4)
    expect(wrapper.findAll('.item-list li')[3].text()).toContain('Enter Item')
  })

  it('should remove items from the list', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    expect(wrapper.findAll('.item-list li').length).toBe(3)

    await wrapper.findAll('.delete-btn')[0].trigger('click')

    expect(wrapper.findAll('.item-list li').length).toBe(2)
  })

  it('should show empty tip when all items are removed', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    await wrapper.findAll('.delete-btn')[0].trigger('click')
    await wrapper.findAll('.delete-btn')[0].trigger('click')
    await wrapper.findAll('.delete-btn')[0].trigger('click')

    expect(wrapper.find('.empty-tip').exists()).toBe(true)
    expect(wrapper.find('.empty-tip').text()).toBe('暂无数据')
  })

  it('should fetch and display todo data on mount', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    await vi.waitFor(() => {
      expect(wrapper.find('.data-content').exists()).toBe(true)
    })

    expect(wrapper.find('.data-content p').text()).toContain('任务 ID: #1')
    expect(fetchTodo).toHaveBeenCalledTimes(1)
  })

  it('should display error state when fetch fails', async () => {
    vi.mocked(fetchTodo).mockRejectedValue(new Error('API Error'))

    const wrapper = createWrapper()

    await vi.waitFor(() => {
      expect(wrapper.find('.state-box.error').exists()).toBe(true)
    })

    expect(wrapper.find('.state-box.error').text()).toBe('获取数据失败，请重试。')
  })

  it('should refresh data when refresh button is clicked', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    await vi.waitFor(() => {
      expect(wrapper.find('.data-content').exists()).toBe(true)
    })

    const newTodo: Todo = { ...mockTodo, id: 2, title: 'New Todo' }
    vi.mocked(fetchTodo).mockResolvedValue(newTodo)

    await wrapper.find('.btn-outline').trigger('click')

    await vi.waitFor(() => {
      expect(fetchTodo).toHaveBeenCalledTimes(2)
    })
  })

  it('should display pending status for incomplete todo', async () => {
    vi.mocked(fetchTodo).mockResolvedValue({ ...mockTodo, completed: false })

    const wrapper = createWrapper()

    await vi.waitFor(() => {
      expect(wrapper.find('.status-dot.pending').exists()).toBe(true)
    })
  })

  it('should display done status for completed todo', async () => {
    vi.mocked(fetchTodo).mockResolvedValue({ ...mockTodo, completed: true })

    const wrapper = createWrapper()

    await vi.waitFor(() => {
      expect(wrapper.find('.status-dot.done').exists()).toBe(true)
    })
  })

  it('should display tech list', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    expect(wrapper.find('.tech-list').exists()).toBe(true)
    expect(wrapper.findAll('.tech-list li').length).toBe(5)
  })

  it('should display footer links', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    expect(wrapper.find('.footer-links').exists()).toBe(true)
    expect(wrapper.findAll('.footer-links .links a').length).toBe(5)
  })

  it('should disable add button when input is empty', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    expect(wrapper.find('.input-group .btn-primary').attributes('disabled')).toBeDefined()

    await wrapper.find('.form-input').setValue('test')
    expect(wrapper.find('.input-group .btn-primary').attributes('disabled')).toBeUndefined()

    await wrapper.find('.form-input').setValue('   ')
    expect(wrapper.find('.input-group .btn-primary').attributes('disabled')).toBeDefined()
  })

  it('should call initData on mount', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    createWrapper()
    expect(fetchTodo).toHaveBeenCalledTimes(1)
  })

  it('should call Math.random in initData', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5)

    createWrapper()

    expect(Math.random).toHaveBeenCalled()
    expect(fetchTodo).toHaveBeenCalledWith(101)

    spy.mockRestore()
  })

  it('should set loading to true initially then false after success', async () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()

    expect((wrapper.vm as any).loading).toBe(true)

    await vi.waitFor(() => {
      expect((wrapper.vm as any).loading).toBe(false)
    })
  })

  it('should set loading to false after error', async () => {
    vi.mocked(fetchTodo).mockRejectedValue(new Error('API Error'))

    const wrapper = createWrapper()

    expect((wrapper.vm as any).loading).toBe(true)

    await vi.waitFor(() => {
      expect((wrapper.vm as any).loading).toBe(false)
    })
  })

  it('should set errorMsg on fetch failure', async () => {
    vi.mocked(fetchTodo).mockRejectedValue(new Error('API Error'))

    const wrapper = createWrapper()

    await vi.waitFor(() => {
      expect((wrapper.vm as any).errorMsg).toBe('获取数据失败，请重试。')
    })
  })

  it('should have initial items array', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    expect((wrapper.vm as any).items).toEqual(['Vue 3', 'TypeScript', 'Vite'])
  })

  it('should have initial empty newItem and todoData', () => {
    vi.mocked(fetchTodo).mockResolvedValue(mockTodo)
    const wrapper = createWrapper()
    expect((wrapper.vm as any).newItem).toBe('')
    expect((wrapper.vm as any).todoData).toBeNull()
  })
})
