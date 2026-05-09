import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

const apiClient: AxiosInstance = axios.create({
  // 使用环境变量配置 Base URL，兼顾开发与生产环境
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 响应拦截器：统一处理错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    // 实际项目中可在此接入 UI 组件库的 Toast/Notification
    const message = error.response?.data?.message || '网络错误'
    console.error('[API Error]:', message)
    return Promise.reject(error)
  }
)

export default apiClient
