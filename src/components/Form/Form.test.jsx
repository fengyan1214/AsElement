import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import Form from './Form.vue'
import FormItem from './FormItem.vue'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import { vi } from 'vitest'

describe('Form组件测试 - 使用真实组件', () => {
  // 模拟表单数据和规则
  const createFormModel = () => ({
    name: '张三',
    email: 'test@example.com',
    age: '',
  })

  const formRules = {
    name: [
      { required: true, message: '姓名不能为空', trigger: 'blur' },
      { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' },
    ],
    email: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
    age: [
      { required: true, message: '年龄不能为空', trigger: 'blur' },
      { type: 'number', message: '请输入数字', trigger: 'blur' },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper: 包装 Form 的父组件，保证 slot 内的 v-model 能正确绑定到 model
  const mountWithSlots = (model, rules, slotTemplate) => {
    const TestForm = defineComponent({
      components: {
        AsForm: Form,
        AsFormItem: FormItem,
        AsInput: Input,
        AsIcon: Icon,
      },
      props: ['model', 'rules'],
      template: `
        <AsForm :model="model" :rules="rules">
          ${slotTemplate}
        </AsForm>
      `,
    })

    return mount(TestForm, {
      props: { model, rules },
      global: {
        stubs: {
          AsIcon: { template: '<i></i>' },
        },
      },
    })
  }

  test('表单组件正确渲染', () => {
    const model = createFormModel()
    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
      <AsFormItem label="邮箱" prop="email">
        <AsInput v-model="model.email" />
      </AsFormItem>
    `,
    )

    // 验证Form组件正确渲染
    expect(wrapper.find('.as-form').exists()).toBe(true)

    // 验证FormItem组件正确渲染
    const formItems = wrapper.findAllComponents(FormItem)
    expect(formItems.length).toBe(2)

    // 验证Input组件正确渲染
    const inputs = wrapper.findAllComponents(Input)
    expect(inputs.length).toBe(2)
  })

  test('表单验证成功', async () => {
    const model = createFormModel()
    model.age = '25'

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
      <AsFormItem label="邮箱" prop="email">
        <AsInput v-model="model.email" />
      </AsFormItem>
      <AsFormItem label="年龄" prop="age">
        <AsInput v-model="model.age" />
      </AsFormItem>
    `,
    )

    // 获取 Form 组件实例并执行验证
    const formWrapper = wrapper.findComponent(Form)
    console.log(formWrapper.exists()) // 确认是否为 true
    console.log(formWrapper.vm) // 查看 vm 上是否有 validate 方法
    const result = await formWrapper.vm.validate()

    expect(result).toBe(true)

    // 验证所有表单项都处于 success 状态
    const formItems = wrapper.findAllComponents(FormItem)
    formItems.forEach((item) => {
      expect(item.classes()).toContain('is-success')
      expect(item.classes()).not.toContain('is-error')
    })
  })

  test('表单验证失败', async () => {
    const model = createFormModel()
    // age 为空，会触发验证失败

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
      <AsFormItem label="年龄" prop="age">
        <AsInput v-model="model.age" />
      </AsFormItem>
    `,
    )

    const formWrapper = wrapper.findComponent(Form)

    try {
      await formWrapper.vm.validate()
      // 如果验证通过，测试失败
      expect(true).toBe(false)
    } catch (error) {
      // 验证验证失败，并包含正确的错误信息
      expect(error).toHaveProperty('age')
      expect(error.age[0].message).toBe('年龄不能为空')
    }

    // 等待DOM更新
    await wrapper.vm.$nextTick()

    // 验证年龄输入框的表单项处于 error 状态
    const ageFormItem = wrapper
      .findAllComponents(FormItem)
      .find((item) => item.props('prop') === 'age')
    expect(ageFormItem.classes()).toContain('is-error')
    expect(ageFormItem.find('.as-form-item__error-msg').text()).toContain('年龄不能为空')
  })

  test('Input组件触发blur事件时进行验证', async () => {
    const model = createFormModel()
    model.age = '' // 空值会触发验证失败

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="年龄" prop="age">
        <AsInput v-model="model.age" />
      </AsFormItem>
    `,
    )

    // 获取Input组件的输入框并触发blur事件
    const input = wrapper.find('input')
    await input.trigger('blur')

    // 等待DOM更新
    await wrapper.vm.$nextTick()

    // 验证表单项处于error状态并有错误提示
    const formItem = wrapper.findComponent(FormItem)
    expect(formItem.classes()).toContain('is-error')
    expect(formItem.find('.as-form-item__error-msg').text()).toContain('年龄不能为空')
  })

  test('resetFields方法重置所有表单项', async () => {
    const model = createFormModel()
    const originalName = model.name

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
      <AsFormItem label="邮箱" prop="email">
        <AsInput v-model="model.email" />
      </AsFormItem>
    `,
    )

    // 修改表单值并触发验证（确保作用在原生 input）
    model.name = ''
    await wrapper.vm.$nextTick()
    const inputs = wrapper.findAll('input')
    const nameInput = inputs[0] // 明确作用于第一个（name）输入框
    await nameInput.setValue('')
    await nameInput.trigger('blur')
    await wrapper.vm.$nextTick()

    // 验证表单项处于error状态
    let formItem = wrapper.findComponent(FormItem)
    expect(formItem.classes()).toContain('is-error')

    // 调用resetFields方法
    const formWrapper = wrapper.findComponent(Form)
    formWrapper.vm.resetFields()
    await wrapper.vm.$nextTick()

    // 验证表单值被重置
    expect(model.name).toBe(originalName)

    // 验证验证状态被清除
    formItem = wrapper.findComponent(FormItem)
    expect(formItem.classes()).not.toContain('is-error')
    expect(formItem.classes()).not.toContain('is-success')
  })

  test('clearValidate方法清除验证状态', async () => {
    const model = createFormModel()
    model.name = '' // 空值会触发验证失败

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
    `,
    )

    // 触发验证，使表单项处于error状态
    const input = wrapper.find('input')
    await input.trigger('blur')
    await wrapper.vm.$nextTick()

    let formItem = wrapper.findComponent(FormItem)
    expect(formItem.classes()).toContain('is-error')

    // 调用clearValidate方法
    const formWrapper = wrapper.findComponent(Form)
    formWrapper.vm.clearValidate()
    await wrapper.vm.$nextTick()

    // 验证验证状态被清除，但值保持不变
    expect(model.name).toBe('') // 值仍然为空
    formItem = wrapper.findComponent(FormItem)
    expect(formItem.classes()).not.toContain('is-error')
    expect(formItem.find('.as-form-item__error-msg').exists()).toBe(false)
  })

  test('resetFields方法重置指定表单项', async () => {
    const model = createFormModel()
    const originalName = model.name
    model.name = ''
    model.email = ''

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
      <AsFormItem label="邮箱" prop="email">
        <AsInput v-model="model.email" />
      </AsFormItem>
    `,
    )

    // 在 mount 后修改字段，模拟用户修改再重置的场景
    model.name = ''
    model.email = ''
    await wrapper.vm.$nextTick()

    // 只重置name字段
    const formWrapper = wrapper.findComponent(Form)
    formWrapper.vm.resetFields(['name'])
    await wrapper.vm.$nextTick()

    // 验证只有name字段被重置，email字段保持不变
    expect(model.name).toBe(originalName)
    expect(model.email).toBe('')
  })

  test('clearValidate方法清除指定表单项验证状态', async () => {
    const model = createFormModel()
    model.name = ''
    model.email = ''

    const wrapper = mountWithSlots(
      model,
      formRules,
      `
      <AsFormItem label="姓名" prop="name">
        <AsInput v-model="model.name" />
      </AsFormItem>
      <AsFormItem label="邮箱" prop="email">
        <AsInput v-model="model.email" />
      </AsFormItem>
    `,
    )

    // 触发两个字段的验证
    const inputs = wrapper.findAll('input')
    for (const input of inputs) {
      await input.trigger('blur')
    }
    await wrapper.vm.$nextTick()

    // 验证两个表单项都处于error状态
    let formItems = wrapper.findAllComponents(FormItem)
    formItems.forEach((item) => {
      expect(item.classes()).toContain('is-error')
    })

    // 只清除name字段的验证状态
    const formWrapper = wrapper.findComponent(Form)
    formWrapper.vm.clearValidate(['name'])
    await wrapper.vm.$nextTick()

    // 验证只有name字段的验证状态被清除
    formItems = wrapper.findAllComponents(FormItem)
    expect(formItems[0].classes()).not.toContain('is-error')
    expect(formItems[1].classes()).toContain('is-error')
  })
})
