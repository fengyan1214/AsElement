import { mount } from '@vue/test-utils'
import Alert from './Alert.vue'
import { describe, test, expect } from 'vitest'

describe('Alert', () => {
  // 基本渲染测试
  test('组件渲染', () => {
    const wrapper = mount(Alert, {
      props: {
        content: '测试警告',
      },
    })

    // 验证组件是否正确渲染
    expect(wrapper.find('.as-alert').exists()).toBe(true)
    expect(wrapper.text()).toContain('测试警告')
  })

  // 测试不同类型的Alert
  test('should apply correct class for different types', () => {
    const types = ['primary', 'success', 'info', 'warning', 'danger']

    types.forEach((type) => {
      const wrapper = mount(Alert, {
        props: {
          type,
        },
      })

      expect(wrapper.find(`.as-alert-${type}`).exists()).toBe(true)
    })
  })

  // 测试默认类型
  test('should use info as default type', () => {
    const wrapper = mount(Alert)
    expect(wrapper.find('.as-alert-info').exists()).toBe(true)
  })

  // 测试内容渲染 - 使用content属性
  test('should render content from props', () => {
    const wrapper = mount(Alert, {
      props: {
        content: '这是通过content属性设置的内容',
      },
    })

    expect(wrapper.text()).toContain('这是通过content属性设置的内容')
  })

  // 测试内容渲染 - 使用slot
  test('should render content from slot', () => {
    const wrapper = mount(Alert, {
      slots: {
        default: '<span>这是通过slot设置的内容</span>',
      },
    })

    expect(wrapper.text()).toContain('这是通过slot设置的内容')
  })

  // 测试效果样式 - light和dark
  test('should apply correct effect class', () => {
    // 测试dark效果
    const darkWrapper = mount(Alert, {
      props: {
        effect: 'dark',
      },
    })
    const darkAlert = darkWrapper.find('.as-alert')
    expect(darkAlert.exists()).toBe(true)
    expect(darkAlert.classes()).toContain('is-dark')

    // 测试默认light效果
    const lightWrapper = mount(Alert)
    expect(lightWrapper.find('.as-alert').classes()).not.toContain('is-dark')
  })

  // 测试可关闭功能
  test('should be closable when closable prop is true', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        content: '可关闭的警告',
      },
    })

    // 验证关闭按钮存在
    const closeBtn = wrapper.find('.as-alert__close')
    expect(closeBtn.exists()).toBe(true)

    // 点击关闭按钮
    await closeBtn.trigger('click')

    // 验证组件已隐藏
    expect(wrapper.find('.as-alert').exists()).toBe(false)
  })

  // 测试不可关闭
  test('should not show close button when closable prop is false', () => {
    const wrapper = mount(Alert, {
      props: {
        closable: false,
      },
    })

    // 验证关闭按钮不存在
    const closeBtn = wrapper.find('.as-alert__close')
    expect(closeBtn.exists()).toBe(false)
  })

  // 测试居中对齐
  test('should center content when center prop is true', () => {
    const wrapper = mount(Alert, {
      props: {
        center: true,
      },
    })

    // 验证内容区域有居中样式
    const contentElement = wrapper.find('.as-alert__content')
    expect(contentElement.attributes('style')).toContain('justify-content: center')
  })

  // 测试暴露的close方法
  test('should close alert when exposed close method is called', async () => {
    const wrapper = mount(Alert, {
      props: {
        content: '测试通过API关闭',
      },
    })

    // 获取组件实例并调用close方法
    const alertInstance = wrapper.vm
    alertInstance.close()

    await wrapper.vm.$nextTick()

    // 验证组件已隐藏
    expect(wrapper.find('.as-alert').exists()).toBe(false)
  })
})
