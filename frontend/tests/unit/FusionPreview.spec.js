import { defineComponent, h, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  pushMock,
  setSelectedSeamMock,
  validationSpatialOverviewMock,
  createGeomodelJobMock,
  getGeomodelJobMock,
  getGeomodelIntegrationJobsMock,
  getGeomodelIntegrationVisualizationMock,
  getGeomodelStressProfileMock,
  listGeomodelArtifactsMock
} = vi.hoisted(() => ({
  pushMock: vi.fn(),
  setSelectedSeamMock: vi.fn(),
  validationSpatialOverviewMock: vi.fn(),
  createGeomodelJobMock: vi.fn(),
  getGeomodelJobMock: vi.fn(),
  getGeomodelIntegrationJobsMock: vi.fn(),
  getGeomodelIntegrationVisualizationMock: vi.fn(),
  getGeomodelStressProfileMock: vi.fn(),
  listGeomodelArtifactsMock: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: pushMock })
}))

vi.mock('../../src/api.js', () => ({
  createGeomodelJob: createGeomodelJobMock,
  getApiErrorMessage: (error, fallback = 'error') => error?.message || fallback,
  getCoalSeams: vi.fn(async () => ({ data: { seams: [{ name: '3-1煤' }] } })),
  getGeomodelIntegrationJobs: getGeomodelIntegrationJobsMock,
  getGeomodelJob: getGeomodelJobMock,
  getGeomodelIntegrationVisualization: getGeomodelIntegrationVisualizationMock,
  getGeomodelStressProfile: getGeomodelStressProfileMock,
  listGeomodelArtifacts: listGeomodelArtifactsMock,
  validationSpatialOverview: validationSpatialOverviewMock
}))

vi.mock('../../src/composables/useI18n.js', () => ({
  useI18n: () => ({
    locale: ref('zh-CN'),
    t: (key) => key.split('.').at(-1)
  })
}))

vi.mock('../../src/composables/useWorkspaceFlow.js', () => ({
  useWorkspaceFlow: () => ({
    workspaceState: { selectedSeam: '3-1煤' },
    setSelectedSeam: setSelectedSeamMock
  })
}))

vi.mock('../../src/components/common/PaperExportMenu.vue', () => ({
  default: defineComponent({
    name: 'PaperExportMenuStub',
    template: '<div class="paper-export-menu-stub"></div>'
  })
}))

const GeoMpiFusion3DStub = defineComponent({
  name: 'GeoMpiFusion3D',
  props: {
    guidedMode: { type: Boolean, default: false },
    guidedPreset: { type: String, default: '' },
    panelLabel: { type: String, default: '' }
  },
  setup(props) {
    return () => h('div', {
      class: 'geo-mpi-fusion-stub',
      'data-guided-mode': props.guidedMode ? 'guided' : 'plain',
      'data-guided-preset': props.guidedPreset,
      'data-panel-label': props.panelLabel
    })
  }
})

import FusionPreview from '../../src/views/FusionPreview.vue'

describe('FusionPreview', () => {
  beforeEach(() => {
    vi.useRealTimers()
    pushMock.mockReset()
    setSelectedSeamMock.mockReset()
    validationSpatialOverviewMock.mockReset()
    createGeomodelJobMock.mockReset()
    getGeomodelJobMock.mockReset()
    getGeomodelIntegrationJobsMock.mockReset()
    getGeomodelIntegrationVisualizationMock.mockReset()
    getGeomodelStressProfileMock.mockReset()
    listGeomodelArtifactsMock.mockReset()

    getGeomodelIntegrationJobsMock.mockResolvedValue({
      data: [{ job_id: 'job-001', status: 'completed', created_at: '2026-03-11T09:00:00Z' }]
    })

    validationSpatialOverviewMock.mockResolvedValue({
      data: {
        grids: { mpi: [[0.21, 0.36], [0.42, 0.58]] },
        statistics: { mpi: { min: 0.21, mean: 0.39, max: 0.58 } },
        bounds: { min_x: 0, max_x: 10, min_y: 0, max_y: 10, min_z: -12, max_z: 0 }
      }
    })
    getGeomodelIntegrationVisualizationMock.mockResolvedValue({
      data: {
        layers: [{ name: 'roof', points: [] }],
        boreholes: [{ name: 'ZK01' }],
        bounds: { min_x: 0, max_x: 10, min_y: 0, max_y: 10, min_z: -12, max_z: 0 }
      }
    })
    getGeomodelStressProfileMock.mockResolvedValue({
      data: {
        anchors: [{ name: 'A1', z_norm: 0.4, importance: 0.9 }]
      }
    })
    createGeomodelJobMock.mockResolvedValue({
      data: {
        job_id: 'gm-101',
        status: 'pending',
        created_at: '2026-03-11T10:00:00Z'
      }
    })
    getGeomodelJobMock.mockResolvedValue({
      data: {
        job_id: 'gm-101',
        status: 'completed',
        created_at: '2026-03-11T10:00:00Z',
        completed_at: '2026-03-11T10:01:00Z',
        result_manifest: {
          quality_summary: {
            continuity_score: 0.93,
            pinchout_ratio: 0.08,
            layer_cv: 0.11
          }
        }
      }
    })
    listGeomodelArtifactsMock.mockResolvedValue({
      data: {
        artifacts: []
      }
    })
  })

  it('auto loads the fusion viewer on entry instead of gating it behind a manual click', async () => {
    const wrapper = mount(FusionPreview, {
      global: {
        stubs: {
          GeoMpiFusion3D: GeoMpiFusion3DStub
        }
      }
    })

    await flushPromises()
    await flushPromises()

    expect(validationSpatialOverviewMock).toHaveBeenCalled()
    expect(getGeomodelIntegrationVisualizationMock).toHaveBeenCalledWith('job-001', { include_mesh: true })
    expect(wrapper.find('.fusion-lazy-card').exists()).toBe(false)
    expect(wrapper.find('.geo-mpi-fusion-stub').attributes('data-guided-mode')).toBe('guided')
    expect(wrapper.find('.geo-mpi-fusion-stub').attributes('data-guided-preset')).toBe('overview')
  })

  it('switches the guided scene preset from the preset rail', async () => {
    const wrapper = mount(FusionPreview, {
      global: {
        stubs: {
          GeoMpiFusion3D: GeoMpiFusion3DStub
        }
      }
    })

    await flushPromises()
    await flushPromises()

    const stressPreset = wrapper.find('[data-preset="stress"]')
    expect(stressPreset.exists()).toBe(true)

    await stressPreset.trigger('click')

    expect(wrapper.find('.geo-mpi-fusion-stub').attributes('data-guided-preset')).toBe('stress')
  })

  it('passes the viewer panel label to the 3D scene in Chinese', async () => {
    const wrapper = mount(FusionPreview, {
      global: {
        stubs: {
          GeoMpiFusion3D: GeoMpiFusion3DStub
        }
      }
    })

    await flushPromises()
    await flushPromises()

    expect(wrapper.find('.geo-mpi-fusion-stub').attributes('data-panel-label')).toBe('图1')
  })

  it('offers in-page geomodel creation when no completed job exists and auto loads the preview after completion', async () => {
    vi.useFakeTimers()
    getGeomodelIntegrationJobsMock.mockResolvedValueOnce({ data: [] })

    const wrapper = mount(FusionPreview, {
      global: {
        stubs: {
          GeoMpiFusion3D: GeoMpiFusion3DStub
        }
      }
    })

    await flushPromises()
    await flushPromises()

    expect(createGeomodelJobMock).not.toHaveBeenCalled()

    const submitButton = wrapper.find('[data-testid="start-geomodel-job"]')
    expect(submitButton.exists()).toBe(true)

    await submitButton.trigger('click')
    await flushPromises()

    expect(createGeomodelJobMock).toHaveBeenCalledWith(expect.objectContaining({
      method: 'thickness',
      resolution: 20,
      output_formats: ['vtk', 'vtp', 'summary', 'quality']
    }))
    expect(createGeomodelJobMock.mock.calls[0][0].seam_name).toBeTruthy()

    await vi.advanceTimersByTimeAsync(1200)
    await flushPromises()
    await flushPromises()

    expect(getGeomodelIntegrationVisualizationMock).toHaveBeenCalledWith('gm-101', { include_mesh: true })
    expect(wrapper.find('.geo-mpi-fusion-stub').attributes('data-guided-preset')).toBe('overview')
  })
})
