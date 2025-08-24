// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward any request that starts with /api or /auth to backend server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, 
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})