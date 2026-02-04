import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  },
  build: {
    // Performance optimizations - use esbuild for faster builds
    minify: 'esbuild',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vue-vendor': ['vue', 'vue-router'],
          // D3 is large, separate it
          'd3': ['d3'],
          // Math rendering - lazy loaded separately
          'katex': ['katex']
        },
        // Asset naming for cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable source code transformation for smaller bundles
    target: 'es2015',
    // Chunk size warning threshold
    chunkSizeWarningLimit: 500
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['vue', 'vue-router', 'd3'],
    exclude: ['katex'] // Load KaTeX on-demand only
  },
  // CSS code splitting
  css: {
    devSourcemap: true
  }
})
