import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import GeoMpiFusion3D from '../../src/components/GeoMpiFusion3D.vue'

describe('GeoMpiFusion3D', () => {
  it('renders the publication frame without triggering computed-property cycles', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = shallowMount(GeoMpiFusion3D, {
      props: {
        paperMode: true,
        loading: false,
        geomodel: {
          layers: [{ name: 'roof', points: [] }],
          boreholes: [{ name: 'ZK01' }]
        },
        stressProfile: {
          anchors: [{ name: 'A1', z_norm: 0.35, importance: 0.8 }]
        },
        mpiGrid: [[0.2, 0.4], [0.5, 0.7]],
        metricStats: { min: 0.2, mean: 0.45, max: 0.7 }
      }
    })

    expect(wrapper.find('.paper-frame-kicker').exists()).toBe(true)
    expect(wrapper.find('.figure-headline').exists()).toBe(true)
  })

  it('keeps advanced controls collapsed in guided mode by default', () => {
    const wrapper = shallowMount(GeoMpiFusion3D, {
      props: {
        guidedMode: true,
        guidedPreset: 'overview',
        loading: true
      }
    })

    expect(wrapper.find('.scene-preset-row').exists()).toBe(true)
    expect(wrapper.find('.scene-advanced-panel').exists()).toBe(false)
  })

  it('uses the compact guided layout instead of the publication caption stack', () => {
    const wrapper = shallowMount(GeoMpiFusion3D, {
      props: {
        guidedMode: true,
        paperMode: true,
        guidedPreset: 'overview',
        loading: false,
        geomodel: {
          layers: [{ name: 'roof', points: [] }],
          boreholes: [{ name: 'ZK01' }]
        },
        stressProfile: {
          anchors: [{ name: 'A1', z_norm: 0.35, importance: 0.8 }]
        },
        mpiGrid: [[0.2, 0.4], [0.5, 0.7]],
        metricStats: { min: 0.2, mean: 0.45, max: 0.7 }
      }
    })

    expect(wrapper.find('.analysis-side-rail').exists()).toBe(true)
    expect(wrapper.find('.caption-overlay').exists()).toBe(false)
    expect(wrapper.find('.figure-overlay.compact').exists()).toBe(true)
  })

  it('renders guided controls and summaries in Chinese by default', () => {
    const wrapper = shallowMount(GeoMpiFusion3D, {
      props: {
        guidedMode: true,
        guidedPreset: 'overview',
        loading: false,
        geomodel: {
          layers: [{ name: 'roof', points: [] }],
          boreholes: [{ name: 'ZK01' }]
        },
        stressProfile: {
          anchors: [{ name: 'A1', z_norm: 0.35, importance: 0.8 }]
        },
        mpiGrid: [[0.2, 0.4], [0.5, 0.7]],
        metricStats: { min: 0.2, mean: 0.45, max: 0.7 }
      }
    })

    expect(wrapper.find('.toolbar-label').text()).toBe('引导视图')
    expect(wrapper.find('[data-preset="overview"]').text()).toContain('总览')
    expect(wrapper.find('.rail-kicker').text()).toBe('洞察侧栏')
    expect(wrapper.text()).not.toContain('Guided view')
    expect(wrapper.text()).not.toContain('Insight rail')
  })

  it('applies the guided section preset to the underlying scene controls', async () => {
    const wrapper = shallowMount(GeoMpiFusion3D, {
      props: {
        guidedMode: true,
        guidedPreset: 'overview',
        loading: true
      }
    })

    await wrapper.find('.scene-advanced-toggle').trigger('click')
    await wrapper.find('[data-preset="section"]').trigger('click')

    expect(wrapper.find('[data-control="sectionEnabled"]').element.checked).toBe(true)
    expect(wrapper.find('[data-control="showStressCloud"]').element.checked).toBe(false)
  })
})
