import Form from './Form.vue'
import FormItem from './FormItem.vue'
import Input from '../Input/Input.vue'
import { mount, flushPromises } from '@vue/test-utils'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

describe('Form组件测试', () => {
  let mockFormData: Record<string, any>
  let mockFormRules: Record<string, any>

  beforeEach(() => {
    vi.clearAllMocks()
    // 每次测试重新初始化数据，避免测试间的相互影响
    mockFormData = ref({
      username: 'test',
      password: '123456',
      email: 'test@example.com',
    })
    mockFormRules = ref({
      username: [
        { required: true, message: '请输入用户名' },
        { min: 3, max: 5, message: '用户名长度必须在3到5个字符之间' },
      ],
      password: [
        { required: true, message: '请输入密码' },
        { trigger: 'blur', pattern: /^\d+$/, message: '密码必须为数字' },
      ],
      email: [
        { required: true, message: '请输入邮箱' },
        { trigger: 'change', type: 'email', message: '请输入正确的邮箱地址' },
      ],
    })
  })

  test('组件基本渲染', () => {
    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model={mockFormData.value.password} />
        </FormItem>
      </Form>
    ))

    expect(wrapper.findComponent(Form).exists()).toBe(true)
    expect(wrapper.findComponent(FormItem).exists()).toBe(true)
    expect(wrapper.findComponent(Input).exists()).toBe(true)
    expect(wrapper.findAllComponents(FormItem)).toHaveLength(2)
  })

  test('表单异步验证 - 验证成功', async () => {
    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
      </Form>
    ))

    const formVm = wrapper.findComponent(Form).vm

    // validate是异步函数，需要使用await等待结果
    const result = await formVm.validate()
    expect(result).toBe(true)
  })

  test('表单异步验证 - 验证失败', async () => {
    // 设置一个必然失败的验证数据
    mockFormData.value.username = 'toolongusername'

    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
      </Form>
    ))

    const formVm = wrapper.findComponent(Form).vm

    // 验证失败应该抛出异常
    await expect(formVm.validate()).rejects.toBeTruthy()

    // 等待DOM更新
    await flushPromises()

    // 检查错误消息是否显示
    const errorMsg = wrapper.find('.as-form-item__error-msg')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toContain('用户名长度必须在3到5个字符之间')
  })

  test('重置所有字段', async () => {
    // 先记录初始值
    const initialValue = { ...mockFormData.value }

    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model={mockFormData.value.password} />
        </FormItem>
      </Form>
    ))

    // 修改表单数据
    mockFormData.value.username = 'changed'
    mockFormData.value.password = 'changed'

    // 调用重置方法
    wrapper.findComponent(Form).vm.resetFields()

    // 验证数据是否恢复
    expect(mockFormData.value.username).toBe(initialValue.username)
    expect(mockFormData.value.password).toBe(initialValue.password)
  })

  test('重置指定字段', () => {
    // 先记录初始值
    const initialUsername = mockFormData.value.username

    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model={mockFormData.value.password} />
        </FormItem>
      </Form>
    ))

    // 修改表单数据
    mockFormData.value.username = 'changed'
    mockFormData.value.password = 'changed'

    // 只重置username字段
    wrapper.findComponent(Form).vm.resetFields(['username'])

    // 验证只有username被重置
    expect(mockFormData.value.username).toBe(initialUsername)
    expect(mockFormData.value.password).toBe('changed')
  })

  test('清除所有验证状态', async () => {
    // 设置验证失败的数据
    mockFormData.value.username = 'toolongusername'

    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
      </Form>
    ))

    const formVm = wrapper.findComponent(Form).vm

    // 先触发验证失败
    await expect(formVm.validate()).rejects.toBeTruthy()
    await flushPromises()

    // 确认有错误状态
    expect(wrapper.findComponent(FormItem).classes()).toContain('is-error')
    expect(wrapper.find('.as-form-item__error-msg').exists()).toBe(true)

    // 清除验证状态
    formVm.clearValidate()
    await flushPromises()

    // 验证错误状态被清除
    expect(wrapper.findComponent(FormItem).classes()).not.toContain('is-error')
    expect(wrapper.findComponent(FormItem).classes()).not.toContain('is-success')
  })

  test('清除指定字段验证状态', async () => {
    // 设置两个字段的验证失败数据
    mockFormData.value.username = 'toolongusername'
    mockFormData.value.email = 'invalid-email'

    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model={mockFormData.value.email} />
        </FormItem>
      </Form>
    ))

    const formVm = wrapper.findComponent(Form).vm

    // 先触发验证失败
    await expect(formVm.validate()).rejects.toBeTruthy()
    await flushPromises()

    // 获取两个表单项
    const formItems = wrapper.findAllComponents(FormItem)
    expect(formItems).toHaveLength(2)

    // 确认两个字段都有错误状态
    expect(formItems[0].classes()).toContain('is-error')
    expect(formItems[1].classes()).toContain('is-error')

    // 只清除username字段的验证状态
    formVm.clearValidate(['username'])
    await flushPromises()

    // 验证只有username的错误状态被清除，email的错误状态仍然存在
    expect(formItems[0].classes()).not.toContain('is-error')
    expect(formItems[1].classes()).toContain('is-error')
  })

  test('通过Input触发验证', async () => {
    // 先设置一个空值，会触发required验证
    mockFormData.value.username = ''

    const wrapper = mount(() => (
      <Form model={mockFormData.value} rules={mockFormRules.value}>
        <FormItem label="用户名" prop="username">
          <Input v-model={mockFormData.value.username} />
        </FormItem>
      </Form>
    ))

    // 模拟用户输入
    const inputElement = wrapper.find('input')
    inputElement.setValue('test')
    inputElement.trigger('input')

    // 等待验证完成
    await flushPromises()

    // 验证字段通过了验证
    expect(wrapper.findComponent(FormItem).classes()).toContain('is-success')
  })
})
