import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    cloudflare()
  ],
  server: {
    port: 5173,
    // Add proxy configuration so frontend calls /api routes and they go to the backend Hono server
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      }
    }
  }
})
