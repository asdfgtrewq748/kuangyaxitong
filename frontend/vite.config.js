import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { resolveManualChunk } from './build/manualChunks.js'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: resolveManualChunk,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    target: 'es2015',
    // The Three.js research viewer is route-scoped and intentionally carries a larger WebGL runtime.
    chunkSizeWarningLimit: 550
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'd3', 'axios', 'jszip'],
    exclude: ['katex', 'echarts']
  },
  css: {
    devSourcemap: true
  }
})
