import { vi } from 'vitest'

vi.stubGlobal('import.meta.env', {
  BASE_URL: '/',
})
