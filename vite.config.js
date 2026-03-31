import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/adareklam/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/firebase/')) return 'vendor-firebase';
          if (id.includes('framer-motion') || id.includes('framesync') || id.includes('popmotion')) return 'vendor-motion';
          if (id.includes('/gsap/')) return 'vendor-gsap';
        },
      },
    },
  },
})
