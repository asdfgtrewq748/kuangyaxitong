import { describe, expect, it } from 'vitest'
import { resolveManualChunk } from '../build/manualChunks.js'

describe('resolveManualChunk', () => {
  it('pins echarts runtime entry chunks to stable names', () => {
    expect(resolveManualChunk('/repo/frontend/src/lib/echarts-pressure.js')).toBe('echarts-pressure')
    expect(resolveManualChunk('/repo/frontend/src/lib/echarts-science.js')).toBe('echarts-science')
  })

  it('pins three runtime entry chunks to stable names', () => {
    expect(resolveManualChunk('/repo/frontend/src/lib/three-basic.js')).toBe('three-basic')
    expect(resolveManualChunk('/repo/frontend/src/lib/three-fusion.js')).toBe('three-fusion')
  })

  it('classifies echarts node_modules by runtime ownership', () => {
    const graph = {
      '/repo/node_modules/echarts/lib/chart/radar/install.js': {
        importers: ['/repo/frontend/src/lib/echarts-pressure.js'],
        dynamicImporters: []
      },
      '/repo/node_modules/echarts/lib/component/toolbox/install.js': {
        importers: ['/repo/frontend/src/lib/echarts-science.js'],
        dynamicImporters: []
      },
      '/repo/node_modules/echarts/core.js': {
        importers: [
          '/repo/frontend/src/lib/echarts-pressure.js',
          '/repo/frontend/src/lib/echarts-science.js'
        ],
        dynamicImporters: []
      }
    }

    const getModuleInfo = (id) => graph[id]

    expect(resolveManualChunk('/repo/node_modules/echarts/lib/chart/radar/install.js', { getModuleInfo })).toBe('echarts-pressure')
    expect(resolveManualChunk('/repo/node_modules/echarts/lib/component/toolbox/install.js', { getModuleInfo })).toBe('echarts-science')
    expect(resolveManualChunk('/repo/node_modules/echarts/core.js', { getModuleInfo })).toBe('echarts-shared')
  })

  it('classifies three node_modules by runtime ownership', () => {
    const graph = {
      '/repo/node_modules/three/src/renderers/WebGLRenderer.js': {
        importers: ['/repo/frontend/src/lib/three-basic.js'],
        dynamicImporters: []
      },
      '/repo/node_modules/three/src/math/Box3.js': {
        importers: ['/repo/frontend/src/lib/three-fusion.js'],
        dynamicImporters: []
      },
      '/repo/node_modules/three/src/scenes/Scene.js': {
        importers: [
          '/repo/frontend/src/lib/three-basic.js',
          '/repo/frontend/src/lib/three-fusion.js'
        ],
        dynamicImporters: []
      }
    }

    const getModuleInfo = (id) => graph[id]

    expect(resolveManualChunk('/repo/node_modules/three/src/renderers/WebGLRenderer.js', { getModuleInfo })).toBe('three-basic')
    expect(resolveManualChunk('/repo/node_modules/three/src/math/Box3.js', { getModuleInfo })).toBe('three-fusion')
    expect(resolveManualChunk('/repo/node_modules/three/src/scenes/Scene.js', { getModuleInfo })).toBe('three-shared')
  })

  it('keeps route chunks stable', () => {
    expect(resolveManualChunk('/repo/frontend/src/views/Interpolation.vue')).toBe('route-interpolation')
    expect(resolveManualChunk('/repo/frontend/src/views/AlgorithmValidation.vue')).toBe('route-algorithm-validation')
  })
})
