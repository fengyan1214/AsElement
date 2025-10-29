import { mount } from '@vue/test-utils'
import Select from './Select.vue'
import { describe, test, expect, vi } from 'vitest'
import { nextTick } from 'vue'

// 模拟测试数据
const mockOptions = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4', disabled: true },
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('Select', () => {
  // 基本渲染测试
  test('组件渲染', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
      },
    })
    expect(wrapper.find('.as-select').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'AsInput' }).exists()).toBe(true)
  })

  // 测试模型值绑定和初始选择状态
  test('should bind modelValue correctly', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '2',
        options: mockOptions,
      },
    })

    // 验证输入框显示选中项的label
    const input = wrapper.findComponent({ name: 'AsInput' })
    expect(input.props('modelValue')).toBe('选项2')
  })

  // 测试下拉菜单显示/隐藏
  test('should toggle dropdown when clicked', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
      },
    })

    // 点击打开下拉菜单
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)
    expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])

    // 再次点击关闭下拉菜单
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)
    expect(wrapper.emitted('visible-change')?.[1]).toEqual([false])
  })

  // 测试选项选择功能
  test('should select option and emit events', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '1',
        options: mockOptions,
      },
    })
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)

    // 选择第二个选项（使用组件真实类名）
    const options = wrapper.findAll('.as-select__menu-item')
    expect(options.length).toBeGreaterThan(1)
    await options[1].trigger('click')
    await nextTick()

    // 验证事件触发
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['2'])
  })

  // 测试禁用状态
  test('should be disabled when disabled prop is true', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
        disabled: true,
      },
    })

    expect(wrapper.classes()).toContain('is-disabled')

    // 禁用状态下点击不应打开下拉菜单
    await wrapper.find('.as-select').trigger('click')
    expect(wrapper.emitted('visible-change')).toBeUndefined()
  })

  // 测试禁用选项
  test('should not select disabled options', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '1',
        options: mockOptions,
      },
    })

    // 找到禁用的选项
    const disabledOption = mockOptions.find((opt) => opt.disabled)
    expect(disabledOption).toBeTruthy()

    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)

    const options = wrapper.findAll('.as-select__menu-item')
    const disabledOptionElement = options.find((option) => option.text() === disabledOption!.label)
    expect(disabledOptionElement).toBeTruthy()
    await disabledOptionElement!.trigger('click')
    await nextTick()

    // 验证没有触发update:modelValue事件
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  // 测试清除功能
  test('should clear selection when clear icon is clicked', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '2',
        options: mockOptions,
        clearable: true,
      },
    })

    // 触发鼠标悬停以显示清除图标
    await wrapper.find('.as-select').trigger('mouseenter')

    // 点击清除图标
    const clearIcon = wrapper.find('.as-input__clear')
    await clearIcon.trigger('click')

    // 验证清除事件和值更新
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('change')?.[0]).toEqual([''])
  })

  // 测试过滤功能
  test('should filter options when filterable is true', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
        filterable: true,
      },
    })

    // 打开下拉菜单
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)

    // 输入过滤文本
    const input = wrapper.findComponent({ name: 'AsInput' })
    await input.setValue('3')
    await nextTick()
    await sleep(0)

    // 这里可以断言过滤后的 DOM 或组件内部 filteredOptions（根据实现）
    const options = wrapper.findAll('.as-select__menu-item')
    expect(options.some((o) => o.text() === '选项3')).toBe(true)
  })

  // 测试自定义过滤方法
  test('should use custom filterMethod', async () => {
    const customFilterMethod = vi.fn((input) =>
      mockOptions.filter((option) => option.label.includes(input)),
    )

    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
        filterable: true,
        filterMethod: customFilterMethod,
      },
    })

    // 打开下拉菜单并输入需要的值
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)

    const input = wrapper.findComponent({ name: 'AsInput' })
    await input.find('input').setValue('2')
    await input.trigger('input')
    await nextTick()
    await sleep(0)

    // 验证自定义过滤方法被调用
    expect(customFilterMethod).toHaveBeenCalledWith('2')
  })

  // 测试键盘事件
  test('should handle keyboard events correctly', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
      },
    })

    // 打开下拉菜单
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)

    // 获取输入元素以触发键盘事件
    const inputElement = wrapper.find('input')

    // 测试下箭头键
    await inputElement.trigger('keydown', { key: 'ArrowDown' })

    // 测试Enter键选择当前高亮项
    await inputElement.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toBeTruthy()

    // 测试Escape键关闭下拉菜单
    await wrapper.find('.as-select').trigger('click') // 重新打开
    await nextTick()
    await sleep(0)
    await inputElement.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('visible-change')?.[3]).toEqual([false])
  })

  // 测试占位符显示
  test('should show placeholder when no value is selected', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: mockOptions,
        placeholder: '请选择',
      },
    })

    const input = wrapper.findComponent({ name: 'AsInput' })
    expect(input.props('placeholder')).toBe('请选择')
  })

  // 测试远程搜索功能
  test('should support remote search', async () => {
    const mockRemoteMethod = vi.fn().mockResolvedValue([
      { label: '远程选项1', value: 'remote1' },
      { label: '远程选项2', value: 'remote2' },
    ])

    const wrapper = mount(Select, {
      props: {
        modelValue: '',
        options: [],
        filterable: true,
        remote: true,
        remoteMethod: mockRemoteMethod,
      },
    })
    // 打开下拉菜单
    await wrapper.find('.as-select').trigger('click')
    await nextTick()
    await sleep(0)

    // 输入搜索关键词
    const input = wrapper.findComponent({ name: 'AsInput' })
    await input.find('input').setValue('search')
    // 等待组件内部 300ms 的防抖与异步调用完成
    await sleep(350)
    await nextTick()

    // 验证远程方法被调用
    expect(mockRemoteMethod).toHaveBeenCalledWith('search')
  })
})
