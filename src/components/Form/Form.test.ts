/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils'
import AsForm from './Form.vue'
import AsFormItem from './FormItem.vue'
import AsInput from '../Input/Input.vue'
import { expect, it, describe } from 'vitest'

describe('Form Component', () => {
  it('should validate form successfully when all fields are valid', async () => {
    const wrapper = mount({
      components: {
        AsForm,
        AsFormItem,
        AsInput,
      },
      template: `
        <AsForm ref="form" :model="model" :rules="rules">
          <AsFormItem label="Username" prop="username">
            <AsInput v-model="model.username" />
          </AsFormItem>
          <AsFormItem label="Email" prop="email">
            <AsInput v-model="model.email" />
          </AsFormItem>
        </AsForm>
      `,
      data() {
        return {
          model: {
            username: 'testuser',
            email: 'test@example.com',
          },
          rules: {
            username: [{ required: true, message: 'Please input username' }],
            email: [
              { required: true, message: 'Please input email' },
              { type: 'email', message: 'Please input valid email' },
            ],
          },
        }
      },
    })

    const form = wrapper.findComponent({ name: 'AsForm' })
    const result = await form.vm.validate()
    expect(result).toBe(true)
  })

  it('should reject validation when fields are invalid', async () => {
    const wrapper = mount({
      components: {
        AsForm,
        AsFormItem,
        AsInput,
      },
      template: `
        <AsForm ref="form" :model="model" :rules="rules">
          <AsFormItem label="Username" prop="username">
            <AsInput v-model="model.username" />
          </AsFormItem>
          <AsFormItem label="Email" prop="email">
            <AsInput v-model="model.email" />
          </AsFormItem>
        </AsForm>
      `,
      data() {
        return {
          model: {
            username: '',
            email: 'invalid-email',
          },
          rules: {
            username: [{ required: true, message: 'Please input username' }],
            email: [
              { required: true, message: 'Please input email' },
              { type: 'email', message: 'Please input valid email' },
            ],
          },
        }
      },
    })

    const form = wrapper.findComponent({ name: 'AsForm' })
    try {
      await form.vm.validate()
      expect.fail('Validation should have failed')
    } catch (error: any) {
      expect(error).toHaveProperty('username')
      expect(error).toHaveProperty('email')
    }
  })

  it('should reset fields to initial values', async () => {
    const wrapper = mount({
      components: {
        AsForm,
        AsFormItem,
        AsInput,
      },
      template: `
        <AsForm ref="form" :model="model" :rules="rules">
          <AsFormItem label="Username" prop="username">
            <AsInput v-model="model.username" />
          </AsFormItem>
        </AsForm>
      `,
      data() {
        return {
          model: {
            username: 'initial',
          },
          rules: {
            username: [{ required: true, message: 'Please input username' }],
          },
        }
      },
    })

    const form = wrapper.findComponent({ name: 'AsForm' })
    const vm = wrapper.vm as any

    // Change the value
    vm.model.username = 'changed'
    await wrapper.vm.$nextTick()

    // Reset fields
    form.vm.resetFields()
    await wrapper.vm.$nextTick()

    expect(vm.model.username).toBe('initial')
  })

  it('should clear validation status', async () => {
    const wrapper = mount({
      components: {
        AsForm,
        AsFormItem,
        AsInput,
      },
      template: `
        <AsForm ref="form" :model="model" :rules="rules">
          <AsFormItem label="Username" prop="username">
            <AsInput v-model="model.username" />
          </AsFormItem>
        </AsForm>
      `,
      data() {
        return {
          model: {
            username: '',
          },
          rules: {
            username: [{ required: true, message: 'Please input username' }],
          },
        }
      },
    })

    const form = wrapper.findComponent({ name: 'AsForm' })
    const formItem = wrapper.findComponent({ name: 'AsFormItem' })

    // Trigger validation failure
    try {
      await form.vm.validate()
    } catch (error) {
      throw error
    }
    await wrapper.vm.$nextTick()

    // Check error state
    expect(formItem.classes()).toContain('is-error')

    // Clear validation
    form.vm.clearValidate()
    await wrapper.vm.$nextTick()

    // Check that error state is cleared
    expect(formItem.classes()).not.toContain('is-error')
  })

  it('should reset specific fields when keys are provided', async () => {
    const wrapper = mount({
      components: {
        AsForm,
        AsFormItem,
        AsInput,
      },
      template: `
        <AsForm ref="form" :model="model" :rules="rules">
          <AsFormItem label="Username" prop="username">
            <AsInput v-model="model.username" />
          </AsFormItem>
          <AsFormItem label="Email" prop="email">
            <AsInput v-model="model.email" />
          </AsFormItem>
        </AsForm>
      `,
      data() {
        return {
          model: {
            username: 'initial',
            email: 'initial@example.com',
          },
          rules: {
            username: [{ required: true, message: 'Please input username' }],
            email: [{ required: true, message: 'Please input email' }],
          },
        }
      },
    })

    const form = wrapper.findComponent({ name: 'AsForm' })
    const vm = wrapper.vm as any

    // Change both values
    vm.model.username = 'changed'
    vm.model.email = 'changed@example.com'
    await wrapper.vm.$nextTick()

    // Reset only username
    form.vm.resetFields(['username'])
    await wrapper.vm.$nextTick()

    expect(vm.model.username).toBe('initial')
    expect(vm.model.email).toBe('changed@example.com')
  })

  it('should clear validation for specific fields when keys are provided', async () => {
    const wrapper = mount({
      components: {
        AsForm,
        AsFormItem,
        AsInput,
      },
      template: `
        <AsForm ref="form" :model="model" :rules="rules">
          <AsFormItem label="Username" prop="username">
            <AsInput v-model="model.username" />
          </AsFormItem>
          <AsFormItem label="Email" prop="email">
            <AsInput v-model="model.email" />
          </AsFormItem>
        </AsForm>
      `,
      data() {
        return {
          model: {
            username: '',
            email: '',
          },
          rules: {
            username: [{ required: true, message: 'Please input username' }],
            email: [{ required: true, message: 'Please input email' }],
          },
        }
      },
    })

    const form = wrapper.findComponent({ name: 'AsForm' })
    const formItems = wrapper.findAllComponents({ name: 'AsFormItem' })

    // Trigger validation failure for both fields
    try {
      await form.vm.validate()
    } catch (error) {
      throw error
    }
    await wrapper.vm.$nextTick()

    // Check both are in error state
    expect(formItems[0].classes()).toContain('is-error')
    expect(formItems[1].classes()).toContain('is-error')

    // Clear validation only for username
    form.vm.clearValidate(['username'])
    await wrapper.vm.$nextTick()

    // Check only username error is cleared
    expect(formItems[0].classes()).not.toContain('is-error')
    expect(formItems[1].classes()).toContain('is-error')
  })
})
