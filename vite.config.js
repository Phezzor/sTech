import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:47230', // ganti sesuai port backend Express-mu
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
