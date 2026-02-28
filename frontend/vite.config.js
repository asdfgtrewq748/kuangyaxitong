import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const routeChunkMap = [
  ['src/views/DataImport.vue', 'route-data-import'],
  ['src/views/Interpolation.vue', 'route-interpolation'],
  ['src/views/MpiHeatmapPro.vue', 'route-mpi-heatmap-pro'],
  ['src/views/AcademicAlgorithm.vue', 'route-academic-algorithm'],
  ['src/views/AlgorithmValidation.vue', 'route-algorithm-validation'],
  ['src/views/ResearchWorkbench.vue', 'route-research-workbench'],
  ['src/views/GeoMpiStudio.vue', 'route-geo-mpi-studio'],
  ['src/views/Steps.vue', 'route-steps'],
  ['src/views/Report.vue', 'route-report'],
  ['src/views/GeomodelVisualization.vue', 'route-geomodel-visualization'],
  ['src/views/Scene3DPage.vue', 'route-scene3d']
]

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
          const normalizedId = String(id).replace(/\\/g, '/')

          const routeChunk = routeChunkMap.find(([pattern]) => normalizedId.includes(pattern))
          if (routeChunk) return routeChunk[1]

          if (!normalizedId.includes('node_modules')) return

          if (normalizedId.includes('node_modules/pinia/')) return 'state'
          if (normalizedId.includes('node_modules/vue-router/')) return 'vue-router'
          if (normalizedId.includes('node_modules/echarts/')) return 'echarts'
          if (normalizedId.includes('node_modules/d3/')) return 'd3'
          if (normalizedId.includes('node_modules/three/')) return 'three'
          if (normalizedId.includes('node_modules/katex/')) return 'katex'
          if (normalizedId.includes('node_modules/jszip/')) return 'jszip'
          if (normalizedId.includes('node_modules/axios/')) return 'network'

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
