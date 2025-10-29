<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, h } from 'vue'
import type { SelectOption } from './components/Select/types';
import Form from './components/Form/Form.vue';
import FormItem from './components/Form/FormItem.vue';
import Select from './components/Select/Select.vue';
import Input from './components/Input/Input.vue';
import type { FormExpose, FormItemExpose } from './components/Form/types';
import Alert from './components/Alert/Alert.vue';

const inputVal = ref('')
const options = [
  {
    label: '选项1',
    value: '1',
  },
  {
    label: '选项2',
    value: '2',
  },
  {
    label: '选项3',
    value: '3',
    disabled: true,
  },
  {
    label: '选项4',
    value: '4',
    divided: true,
  },
  {
    label: '选项5',
    value: '5',
  },
]
const renderLabel = (option: SelectOption) => {
  return h('span', {
    class: 'custom-label',
  }, option.label)
}
const remoteMethod = (query: string) => {
  return new Promise<SelectOption[]>((resolve) => {
    setTimeout(() => {
      resolve(options.filter((item) => item.label.includes(query)))
    }, 1000)
  })
}

const model = ref({
  username: '',
  password: '',
  confirmPassword: '',
})
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 5, message: '用户名长度必须在3到5之间', trigger: 'input' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule: any, value: string) => value === model.value.password, message: '两次输入密码不一致', trigger: 'blur' },
  ],
})
const formRef = ref<FormExpose>()
const submit = async () => {
  try {
    await formRef.value?.validate()
    console.log('表单校验通过')
  } catch (e) {
    console.log('表单校验失败', e)
  }
}
const passwordFormItem = ref<FormItemExpose>()
</script>

<template>
  <div>
    <Select remote :remote-method="remoteMethod" :render-label="renderLabel" clearable filterable v-model="inputVal"
      placeholder="请选择"></Select>
  </div>
  <div style="width: 500px;">
    <Form ref="formRef" :model="model" :rules="rules">
      <FormItem label="用户名" prop="username">
        <Input v-model="model.username" type="text" />
      </FormItem>
      <FormItem ref="passwordFormItem" label="密码" prop="password">
        <Input v-model="model.password" type="password" />
      </FormItem>
      <FormItem label="确认密码" prop="confirmPassword">
        <Input v-model="model.confirmPassword" type="password" />
      </FormItem>

      <FormItem>
        <button @click.prevent="submit">提交</button>
        <button @click.prevent="formRef?.validate">校验</button>
        <button @click.prevent="() => formRef?.resetFields()">重置</button>
        <button @click.prevent="() => formRef?.clearValidate()">清除校验</button>
        <button @click.prevent="() => passwordFormItem?.resetField()">重置密码</button>
      </FormItem>
    </Form>
  </div>
  <Alert content="成功" type="success" effect="dark" />
</template>

<style scoped></style>
