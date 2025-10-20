import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import Collapse from './Collapse.vue'
import CollapseItem from './CollapseItem.vue'
describe('Collapse.vue', () => {
  test('basic collapse', async () => {
    const wrapper = mount(Collapse, {
      props: {
        modelValue: ['a'],
      },
      slots: {
        default: () => (
          <>
            <CollapseItem name="a" title="title a">
              content a
            </CollapseItem>
            <CollapseItem name="b" title="title b">
              content b
            </CollapseItem>
            <CollapseItem disabled={true} name="c" title="title c">
              content c
            </CollapseItem>
          </>
        ),
      },
      global: {
        stubs: ['FontAwesomeIcon'],
      },
      attachTo: document.body,
    })

    const headers = wrapper.findAll('.as-collapse-item__header')
    const contents = wrapper.findAll('.as-collapse-item__content')
    const contentWrappers = wrapper.findAll('.as-collapse-item__content-wrapper')
    const firstHeader = headers[0]
    const secondHeader = headers[1]
    const thirdHeader = headers[2]

    const firstContent = contents[0]

    const firstContentWrapper = contentWrappers[0]
    const secondContentWrapper = contentWrappers[1]
    const thirdContentWrapper = contentWrappers[2]

    expect(headers.length).toBe(3)
    expect(contents.length).toBe(3)

    expect(firstHeader.text()).toBe('title a')
    expect(firstContent.text()).toBe('content a')

    expect(firstContentWrapper.isVisible()).toBeTruthy()
    expect(secondContentWrapper.isVisible()).toBeFalsy()

    await firstHeader.trigger('click')
    expect(firstContentWrapper.isVisible()).toBeFalsy()
    await secondHeader.trigger('click')
    expect(secondContentWrapper.isVisible()).toBeTruthy()

    // expect(onChange).toHaveBeenCalledWith(['b'])
    // expect(onChange).toHaveBeenCalledWith([])
    expect(wrapper.emitted()).toHaveProperty('change')
    const changeEvent = wrapper.emitted('change')
    console.table(changeEvent)

    expect(thirdHeader.classes()).toContain('is-disabled')
    expect(thirdContentWrapper.isVisible()).toBeFalsy()
    await thirdHeader.trigger('click')
    expect(thirdContentWrapper.isVisible()).toBeFalsy()
  })
})
