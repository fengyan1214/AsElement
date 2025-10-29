import { mount } from '@vue/test-utils'
import Switch from './Switch.vue'
import { describe, expect, test } from 'vitest'

describe('Switch', () => {
  // 测试组件基本渲染
  test('组件渲染', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    })
    console.log('html', wrapper.html())
  })

  // 测试模型值绑定和初始状态
  test('should bind modelValue correctly', () => {
    // 测试初始为true的情况
    const wrapper1 = mount(Switch, {
      props: {
        modelValue: true,
      },
    })
    expect(wrapper1.classes()).toContain('is-checked')
    const input1 = wrapper1.find('input.as-switch__input')
    expect((input1.element as HTMLInputElement).checked).toBe(true)

    // 测试初始为false的情况
    const wrapper2 = mount(Switch, {
      props: {
        modelValue: false,
      },
    })
    expect(wrapper2.classes()).not.toContain('is-checked')
    const input2 = wrapper2.find('input.as-switch__input')
    expect((input2.element as HTMLInputElement).checked).toBe(false)
  })

  // 测试点击切换功能
  test('should toggle value when clicked', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    })

    // 点击切换到true
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])

    // 更新props，模拟v-model更新
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('is-checked')

    // 再次点击切换到false
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
    expect(wrapper.emitted('change')?.[1]).toEqual([false])
  })

  // 测试禁用状态
  test('should not toggle when disabled', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  // 测试自定义activeValue和inactiveValue
  test('should work with custom activeValue and inactiveValue', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: 'on',
        activeValue: 'on',
        inactiveValue: 'off',
      },
    })

    expect(wrapper.classes()).toContain('is-checked')

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['off'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['off'])
  })

  // 测试数值类型的自定义值
  test('should work with numeric custom values', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: 1,
        activeValue: 1,
        inactiveValue: 0,
      },
    })

    expect(wrapper.classes()).toContain('is-checked')

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
    expect(wrapper.emitted('change')?.[0]).toEqual([0])
  })

  // 测试尺寸属性
  test('should apply correct size class', () => {
    const largeWrapper = mount(Switch, {
      props: {
        modelValue: false,
        size: 'large',
      },
    })
    expect(largeWrapper.classes()).toContain('as-switch-large')

    const smallWrapper = mount(Switch, {
      props: {
        modelValue: false,
        size: 'small',
      },
    })
    expect(smallWrapper.classes()).toContain('as-switch-small')
  })

  // 测试文本显示
  test('should display activeText and inactiveText correctly', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: true,
        activeText: '开',
        inactiveText: '关',
      },
    })

    let textElement = wrapper.find('.as-switch__core-inner-test')
    expect(textElement.text()).toBe('开')

    // 切换到inactive状态
    wrapper.unmount()
    const wrapperInactive = mount(Switch, {
      props: {
        modelValue: false,
        activeText: '开',
        inactiveText: '关',
      },
    })

    textElement = wrapperInactive.find('.as-switch__core-inner-test')
    expect(textElement.text()).toBe('关')
  })

  // 测试键盘事件
  test('should toggle value when pressing Enter key', async () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
      },
    })

    const input = wrapper.find('input.as-switch__input')
    await input.trigger('keydown.enter')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  // 测试name属性
  test('should set name attribute correctly', () => {
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        name: 'switch-test',
      },
    })

    const input = wrapper.find('input.as-switch__input')
    expect(input.attributes('name')).toBe('switch-test')
  })
})
