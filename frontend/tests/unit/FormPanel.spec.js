import { mount } from '@vue/test-utils'
import FormPanel from '@/components/library/layout/FormPanel.vue'

describe('FormPanel', () => {
  it('emits submit on form submit', async () => {
    const wrapper = mount(FormPanel, {
      props: {
        title: 'Config',
        columns: 3
      },
      slots: {
        default: '<label class="full"><span>Name</span><input /></label>'
      }
    })

    expect(wrapper.find('.form-panel-title').text()).toBe('Config')
    expect(wrapper.find('.form-panel-grid').attributes('style')).toContain('repeat(3')

    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('does not emit submit when disabled or loading', async () => {
    const disabledWrapper = mount(FormPanel, {
      props: { submitDisabled: true }
    })
    await disabledWrapper.find('form').trigger('submit')
    expect(disabledWrapper.emitted('submit')).toBeFalsy()

    const loadingWrapper = mount(FormPanel, {
      props: { submitLoading: true }
    })
    await loadingWrapper.find('form').trigger('submit')
    expect(loadingWrapper.emitted('submit')).toBeFalsy()
    expect(loadingWrapper.find('.spinner').exists()).toBe(true)
  })

  it('emits cancel when showCancel is enabled', async () => {
    const wrapper = mount(FormPanel, {
      props: {
        showCancel: true,
        cancelText: 'Back'
      }
    })

    const cancelButton = wrapper.find('.btn.secondary')
    expect(cancelButton.exists()).toBe(true)
    expect(cancelButton.text()).toBe('Back')

    await cancelButton.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })
})
