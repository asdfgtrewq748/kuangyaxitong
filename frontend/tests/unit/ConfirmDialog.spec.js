import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfirmDialog from '@/components/library/feedback/ConfirmDialog.vue'

function mountDialog(props = {}) {
  return mount(ConfirmDialog, {
    props,
    global: {
      stubs: {
        teleport: true
      }
    }
  })
}

describe('ConfirmDialog', () => {
  it('renders content when open and closes on cancel', async () => {
    const wrapper = mountDialog({
      modelValue: true,
      title: 'Delete Item',
      message: 'This cannot be undone.'
    })

    expect(wrapper.find('.confirm-dialog-mask').exists()).toBe(true)
    expect(wrapper.text()).toContain('Delete Item')
    expect(wrapper.text()).toContain('This cannot be undone.')

    await wrapper.find('.btn.cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('emits confirm and respects closeOnConfirm=false', async () => {
    const wrapper = mountDialog({
      modelValue: true,
      closeOnConfirm: false
    })

    await wrapper.find('.btn.confirm').trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('closes on Escape when enabled', async () => {
    const wrapper = mountDialog({
      modelValue: true,
      closeOnEsc: true
    })

    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})
