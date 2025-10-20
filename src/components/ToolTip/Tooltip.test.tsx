import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from './Tooltip.vue'
const change = vi.fn()
describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  test('mount', async () => {
    const wrapper = mount(
      () => (
        <div>
          <div class="outside"></div>
          <Tooltip onVisible-change={change} trigger="click" content="展示区域">
            <div>这是一个提示</div>
          </Tooltip>
        </div>
      ),
      {
        attachTo: document.body,
      },
    )
    console.log(wrapper.html())
    const triggerArea = wrapper.find('.as-tooltip__trigger')
    expect(triggerArea.exists()).toBeTruthy()
    expect(wrapper.find('.as-tooltip__popper').exists()).toBeFalsy()
    triggerArea.trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.as-tooltip__popper').exists()).toBeTruthy()
    triggerArea.trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.as-tooltip__popper').exists()).toBeFalsy()

    const outside = wrapper.find('.outside')
    expect(outside.exists()).toBeTruthy()
    triggerArea.trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.as-tooltip__popper').exists()).toBeTruthy()
    outside.trigger('click')
    await vi.runAllTimers()
    expect(wrapper.find('.as-tooltip__popper').exists()).toBeFalsy()
  })
})
