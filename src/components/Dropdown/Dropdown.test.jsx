import { mount } from '@vue/test-utils'
import Dropdown from './Dropdown.vue'
import { nextTick } from 'vue'
import RenderVnode from '../Common/RenderVnode'

describe('Dropdown组件测试', () => {
  // 模拟菜单项数据
  const mockMenuOptions = [
    { key: '1', label: '选项1' },
    { key: '2', label: '选项2', disabled: true },
    { key: '3', label: '选项3', divided: true },
  ]
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('组件基本渲染', () => {
    const wrapper = mount(Dropdown, {
      props: {
        menuOptions: mockMenuOptions,
      },
      slots: {
        default: '<button>下拉按钮</button>',
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
    })

    // 验证组件根元素存在
    expect(wrapper.find('.as-dropdown').exists()).toBe(true)
    // 验证默认插槽内容
    expect(wrapper.text()).toContain('下拉按钮')
  })

  test('菜单项内容正确渲染', () => {
    const wrapper = mount(Dropdown, {
      props: {
        menuOptions: mockMenuOptions,
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
    })

    // 由于使用实际的Tooltip组件，我们需要直接检查内部内容渲染
    const tooltipContent = wrapper.findComponent({ name: 'Tooltip' })
    expect(tooltipContent.exists()).toBe(true)
  })

  test('点击非禁用菜单项触发select事件', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click',
        menuOptions: mockMenuOptions,
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
      slots: {
        default: '<button>下拉按钮</button>',
      },
    })
    wrapper.find('button').trigger('click')
    await nextTick()
    await sleep(0)
    // 点击非禁用菜单项
    const item = wrapper.findAll('.as-dropdown__item').at(0)
    await item.trigger('click')
    await nextTick()
    await sleep(0)

    // 验证select事件被触发
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0][0]).toEqual(mockMenuOptions[0])
  })

  test('点击禁用菜单项不触发select事件', async () => {
    const wrapper = mount(Dropdown, {
      props: {
        trigger: 'click',
        menuOptions: mockMenuOptions,
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
      slots: {
        default: '<button>下拉按钮</button>',
      },
    })
    wrapper.find('button').trigger('click')
    await nextTick()
    await sleep(0)
    // 点击禁用菜单项
    const disabledItem = wrapper.findAll('.as-dropdown__item').at(1)
    await disabledItem.trigger('click')
    await nextTick()
    await sleep(0)

    // 验证select事件未被触发
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  test('暴露的show和hide方法', () => {
    const wrapper = mount(Dropdown, {
      props: {
        menuOptions: mockMenuOptions,
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
    })

    // 获取组件实例
    const dropdownInstance = wrapper.vm

    // 验证方法存在
    expect(typeof dropdownInstance.show).toBe('function')
    expect(typeof dropdownInstance.hide).toBe('function')
  })

  test('visible-change事件传递', () => {
    const wrapper = mount(Dropdown, {
      props: {
        menuOptions: mockMenuOptions,
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
    })

    // 直接调用visibleChange方法
    const visibleChangeMethod = wrapper.vm.visibleChange
    visibleChangeMethod(true)

    // 验证事件被触发
    expect(wrapper.emitted('visible-change')).toBeTruthy()
    expect(wrapper.emitted('visible-change')?.[0][0]).toBe(true)
  })

  test('支持自定义trigger属性', () => {
    const wrapper = mount(Dropdown, {
      props: {
        menuOptions: mockMenuOptions,
        trigger: 'hover',
      },
      global: {
        stubs: {
          RenderVnode: { template: '<span>{{ vNode }}</span>' },
        },
      },
    })

    const tooltipWrapper = wrapper.findComponent({ name: 'Tooltip' })
    expect(tooltipWrapper.props('trigger')).toBe('hover')
  })
})
