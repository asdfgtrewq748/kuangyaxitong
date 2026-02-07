import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  },
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('node_modules/vue-router/')) return 'vue-router'
          if (id.includes('node_modules/echarts/')) return 'echarts'
          if (id.includes('node_modules/d3/')) return 'd3'
          if (id.includes('node_modules/katex/')) return 'katex'
          if (id.includes('node_modules/jszip/')) return 'jszip'
          if (id.includes('node_modules/axios/')) return 'network'

          return 'vendor'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    target: 'es2015',
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'd3', 'axios', 'jszip'],
    exclude: ['katex', 'echarts']
  },
  css: {
    devSourcemap: true
  }
})
