import { describe, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input', () => {
  test('input 组件渲染', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test',
        type: 'text',
        size: 'small',
      },
      slots: {
        prepend: 'prepend',
        append: 'append',
        prefix: 'prefix',
        suffix: 'suffix',
      },
    })
    console.log(wrapper.html())
    // class
    expect(wrapper.classes()).toContain('as-input-small')
    expect(wrapper.classes()).toContain('is-prepend')
    // input
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.get('input').attributes('type')).toBe('text')
    // slot
    expect(wrapper.find('.as-input__prepend').exists()).toBe(true)
    expect(wrapper.get('.as-input__prepend').text()).toBe('prepend')
    // textarea
    const wrapper2 = mount(Input, {
      props: {
        modelValue: 'test',
        type: 'textarea',
        size: 'small',
      },
    })
    expect(wrapper2.find('textarea').exists()).toBe(true)
  })
  test('支持v-model', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test',
        'onUpdate:modelValue': (value) => {
          wrapper.setProps({ modelValue: value })
        },
      },
    })
    const input = wrapper.find('input')
    // 初始值
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('test')
    // 内部更新值
    await input.setValue('update')
    expect(wrapper.props('modelValue')).toBe('update')
    expect(input.element.value).toBe('update')

    console.log('input 组件事件', wrapper.emitted())
    expect(wrapper.emitted()).toHaveProperty('input')
    expect(wrapper.emitted()).toHaveProperty('change')
    const inputEvents = wrapper.emitted('input')
    const changeEvents = wrapper.emitted('change')
    expect(inputEvents![0][0]).toEqual('update')
    expect(changeEvents![0][0]).toEqual('update')
    // 外部更新值
    await wrapper.setProps({ modelValue: 'external' })
    expect(wrapper.props('modelValue')).toBe('external')
    expect(input.element.value).toBe('external')
  })
  test('支持点击清空', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test',
        'onUpdate:modelValue': (value) => {
          wrapper.setProps({ modelValue: value })
        },
        clearable: true,
      },
      global: {
        stubs: ['Icon'],
      },
    })
    // focus前不应显示清空按钮
    expect(wrapper.find('.as-input__clear').exists()).toBe(false)
    // focus后应显示清空按钮
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.find('.as-input__clear').exists()).toBe(true)

    expect(wrapper.emitted()).toHaveProperty('focus')
    // 点击清空
    const clearIcon = wrapper.find('.as-input__clear')
    await clearIcon.trigger('click')
    expect(input.element.value).toBe('')

    expect(wrapper.emitted()).toHaveProperty('clear')
    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted()).toHaveProperty('input')
    const inputEvents = wrapper.emitted('input')
    const changeEvents = wrapper.emitted('change')
    expect(inputEvents![0][0]).toEqual('')
    expect(changeEvents![0][0]).toEqual('')

    await input.trigger('blur')
    expect(wrapper.emitted()).toHaveProperty('blur')
  })
  test('支持密码显示切换', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (value) => {
          wrapper.setProps({ modelValue: value })
        },
        showPassword: true,
      },
      global: {
        stubs: ['Icon'],
      },
    })
    // 初始状态不显示密码切换，因为值为空
    expect(wrapper.find('.as-input__password').exists()).toBe(false)
    // 输入值后显示密码切换
    const input = wrapper.find('input')
    await input.setValue('test')
    expect(wrapper.find('.as-input__password').exists()).toBe(true)

    // 默认不显示密码
    expect(wrapper.find('.as-input__password').attributes('icon')).toBe('eye-slash')
    expect(input.element.type).toBe('password')
    // 点击切换密码显示
    await wrapper.find('.as-input__password').trigger('click')
    expect(wrapper.find('.as-input__password').attributes('icon')).toBe('eye')
    expect(input.element.type).toBe('text')
  })
})
