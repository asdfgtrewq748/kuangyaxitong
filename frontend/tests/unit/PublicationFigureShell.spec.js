import { mount } from '@vue/test-utils'
import PublicationFigureShell from '@/components/common/PublicationFigureShell.vue'

describe('PublicationFigureShell', () => {
  it('renders figure copy and chip rows', () => {
    const wrapper = mount(PublicationFigureShell, {
      props: {
        figureLabel: 'Figure 1',
        caption: 'Integrated risk figure.',
        summary: 'Summarizes the primary observation.',
        chips: ['Heatmap', 'Risk bands', 'Peak annotation'],
        note: 'Scale bar equals 20 m.'
      },
      slots: {
        default: '<div class="slot-body">panel grid</div>'
      }
    })

    expect(wrapper.text()).toContain('Figure 1')
    expect(wrapper.text()).toContain('Integrated risk figure.')
    expect(wrapper.findAll('.shell-chip')).toHaveLength(3)
    expect(wrapper.find('.slot-body').exists()).toBe(true)
    expect(wrapper.text()).toContain('Scale bar equals 20 m.')
  })
})
