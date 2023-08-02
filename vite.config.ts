import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: ['html'],
    coverage: {
      provider: 'istanbul', // or 'v8',
      exclude:[
        ...configDefaults.exclude,
        'src/utils/query.js',
        'src/store/*.js',
      ],
      reporter: ['text', 'json', 'html'],
      
    },
  },
  
})
