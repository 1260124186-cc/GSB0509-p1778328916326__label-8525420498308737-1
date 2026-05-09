<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchTodo, type Todo } from '../api/demo'
import { useCounterStore } from '../stores/counter'

const store = useCounterStore()
const todoData = ref<Todo | null>(null)
const loading = ref(false)
const errorMsg = ref('')

// 新增：本地列表交互逻辑
const newItem = ref('')
const items = ref<string[]>(['Vue 3', 'TypeScript', 'Vite'])

const addItem = () => {
  if (newItem.value.trim()) {
    items.value.push(newItem.value.trim())
    newItem.value = ''
  }
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
}

const initData = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    // 使用封装后的 API 调用
    // 随机获取 ID 为 1-200 之间的 todo
    const randomId = Math.floor(Math.random() * 200) + 1
    todoData.value = await fetchTodo(randomId)
  } catch (err: unknown) {
    errorMsg.value = '获取数据失败，请重试。'
    // eslint-disable-next-line no-undef
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="home-container">
    <div class="welcome-header">
      <h1>项目仪表盘</h1>
      <p class="subtitle">Vue 3, TypeScript, Pinia 和 Axios 的集成示例。</p>
    </div>

    <div class="grid">
      <!-- Card 1: Pinia State -->
      <div class="card">
        <div class="card-header">
          <h3>本地状态</h3>
          <span class="tag">Pinia</span>
        </div>
        <div class="card-body center">
          <div class="counter-display">{{ store.count }}</div>
          <button class="btn btn-primary" @click="store.increment()">
            增加计数
          </button>
        </div>
      </div>

      <!-- Card 2: Network Request -->
      <div class="card">
        <div class="card-header">
          <h3>网络数据</h3>
          <span class="tag">Axios</span>
        </div>
        <div class="card-body">
          <div class="content-wrapper">
            <div v-if="loading" class="state-box loading">加载中...</div>
            <div v-else-if="errorMsg" class="state-box error">{{ errorMsg }}</div>
            <div v-else-if="todoData" class="data-content">
              <p><strong>任务 ID:</strong> #{{ todoData.id }}</p>
              <p><strong>标题:</strong> {{ todoData.title }}</p>
              <p>
                <strong>状态:</strong>
                <span
                  :class="['status-dot', todoData.completed ? 'done' : 'pending']"
                ></span>
                {{ todoData.completed ? '已完成' : '待处理' }}
              </p>
            </div>
          </div>
          <button class="btn btn-outline" :disabled="loading" @click="initData">
            刷新数据
          </button>
        </div>
      </div>

      <!-- Card 3: Interaction Demo -->
      <div class="card">
        <div class="card-header">
          <h3>交互演示</h3>
          <span class="tag">Form</span>
        </div>
        <div class="card-body">
          <div class="input-group">
            <input
              v-model="newItem"
              type="text"
              placeholder="输入内容回车..."
              class="form-input"
              @keyup.enter="addItem"
            />
            <button
              class="btn btn-primary small"
              :disabled="!newItem.trim()"
              @click="addItem"
            >
              添加
            </button>
          </div>
          <ul class="item-list">
            <li v-if="items.length === 0" class="empty-tip">暂无数据</li>
            <li v-for="(item, index) in items" :key="index">
              <span>{{ item }}</span>
              <button class="delete-btn" @click="removeItem(index)">×</button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Card 4: Tech Stack -->
      <div class="card">
        <div class="card-header">
          <h3>技术栈</h3>
          <span class="tag">Info</span>
        </div>
        <div class="card-body">
          <ul class="tech-list">
            <li><span class="dot vue"></span>Vue 3.5+</li>
            <li><span class="dot ts"></span>TypeScript 5.0+</li>
            <li><span class="dot pinia"></span>Pinia Store</li>
            <li><span class="dot vite"></span>Vite 6.0+</li>
            <li><span class="dot sass"></span>Sass / SCSS</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-links">
      <h3>官方资源</h3>
      <div class="links">
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>
        <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener"
          >TypeScript</a
        >
        <a href="https://pinia.vuejs.org/" target="_blank" rel="noopener"
          >Pinia</a
        >
        <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a>
        <a href="https://sass-lang.com/" target="_blank" rel="noopener">Sass</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.welcome-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: var(--text-main);
    margin-bottom: 0.5rem;
  }
  .subtitle {
    color: var(--text-secondary);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.card {
  background: var(--bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
}

.tag {
  background: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;

  &.center {
    align-items: center;
    justify-content: center;
  }
}

.counter-display {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.content-wrapper {
  min-height: 140px;
}

.state-box {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &.error {
    color: #dc2626;
    background: #fef2f2;
  }
  &.loading {
    color: var(--text-secondary);
  }
}

.data-content {
  margin-bottom: 1rem;
  p {
    margin: 0.5rem 0;
    color: var(--text-main);
  }
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;

  &.pending {
    background: #f59e0b;
  }
  &.done {
    background: #10b981;
  }
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: var(--primary-color);
    color: white;
    &:hover {
      opacity: 0.9;
    }
  }

  &.btn-outline {
    background: transparent;
    border: 1px solid #d1d5db;
    color: var(--text-main);
    &:hover {
      border-color: var(--text-secondary);
      background: #f9fafb;
    }
  }

  &.small {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .form-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    outline: none;
    font-size: 0.9rem;

    &:focus {
      border-color: var(--primary-color);
    }
  }
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 180px;
  overflow-y: auto;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: #f3f4f6;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    color: var(--text-main);

    .delete-btn {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 0 0.25rem;

      &:hover {
        color: #ef4444;
      }
    }
  }

  .empty-tip {
    color: var(--text-secondary);
    text-align: center;
    background: none;
    justify-content: center;
    padding-top: 2rem;
  }
}

.tech-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid #f3f4f6;
    color: var(--text-main);
    font-size: 0.95rem;

    &:last-child {
      border-bottom: none;
    }
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 12px;

    &.vue {
      background: #42b883;
    }
    &.ts {
      background: #3178c6;
    }
    &.pinia {
      background: #ffd859;
    }
    &.vite {
      background: #646cff;
    }
    &.sass {
      background: #cf649a;
    }
  }
}

.footer-links {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;

  h3 {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;

    a {
      color: var(--text-main);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;

      &:hover {
        color: var(--primary-color);
        text-decoration: underline;
      }
    }
  }
}
</style>
