<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, h } from 'vue'

// 导入所有组件
import Alert from './components/Alert/Alert.vue'
import Button from './components/Button/Button.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Dropdown from './components/Dropdown/Dropdown.vue'
import Form from './components/Form/Form.vue'
import FormItem from './components/Form/FormItem.vue'
import Icon from './components/Icon/Icon.vue'
import Input from './components/Input/Input.vue'
import Select from './components/Select/Select.vue'
import Switch from './components/Switch/Switch.vue'
import Tooltip from './components/ToolTip/Tooltip.vue'

// 类型导入
import type { SelectOption } from './components/Select/types'
import type { FormExpose, FormItemExpose } from './components/Form/types'
import type { MenuOption } from './components/Dropdown/types'
// 通用响应式数据
const inputVal = ref('')
const switchVal = ref(false)
const activeNames = ref(['1'])

import { createMessage } from './components/Message/method'

// Select组件相关数据
const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3', disabled: true },
  { label: '选项4', value: '4', divided: true },
  { label: '选项5', value: '5' },
]

const renderLabel = (option: SelectOption) => {
  return h('span', { class: 'custom-label' }, option.label)
}

const remoteMethod = (query: string) => {
  return new Promise<SelectOption[]>((resolve) => {
    setTimeout(() => {
      resolve(options.filter((item) => item.label.includes(query)))
    }, 500)
  })
}

// Dropdown组件相关数据
const menuOptions = [
  { label: '新建', key: '1' },
  { label: '编辑', key: '2' },
  { label: '删除', key: '3', disabled: true },
  { label: '导出', key: '4', divided: true }
]

// Collapse组件相关数据
const collapseItems = [
  { name: '1', title: '面板一', content: '这是面板一的内容' },
  { name: '2', title: '面板二', content: '这是面板二的内容' },
  { name: '3', title: '面板三', content: '这是面板三的内容' }
]

// Form组件相关数据
const formModel = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const formRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 5, message: '用户名长度必须在3到5之间', trigger: 'input' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule: any, value: string) => value === formModel.value.password, message: '两次输入密码不一致', trigger: 'blur' },
  ],
})

const formRef = ref<FormExpose>()
const passwordFormItem = ref<FormItemExpose>()

// 方法
const showMessage = () => {
  createMessage({ message: '这是一条消息', type: 'success' })
}

const handleDropdownSelect = (key: MenuOption) => {
  console.log('选择了:', key.label)
}

const submitForm = async () => {
  try {
    await formRef.value?.validate()
    console.log('表单校验通过')
  } catch (e) {
    console.log('表单校验失败', e)
  }
}
</script>

<template>
  <div class="app-container">
    <h1>组件库演示</h1>

    <!-- Button组件演示 -->
    <section class="demo-section">
      <h2>Button 按钮</h2>
      <div class="demo-box">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success">成功按钮</Button>
        <Button type="info">信息按钮</Button>
        <Button type="warning">警告按钮</Button>
        <Button type="danger">危险按钮</Button>
        <Button disabled>禁用按钮</Button>
      </div>
    </section>

    <!-- Alert组件演示 -->
    <section class="demo-section">
      <h2>Alert 提示</h2>
      <div class="demo-box">
        <Alert content="默认提示信息" />
        <Alert content="成功提示" type="success" />
        <Alert content="警告提示" type="warning" closable />
        <Alert content="错误提示" type="danger" effect="dark" />
        <Alert content="信息提示" type="info" show-icon center />
      </div>
    </section>

    <!-- Input组件演示 -->
    <section class="demo-section">
      <h2>Input 输入框</h2>
      <div class="demo-box">
        <Input v-model="inputVal" placeholder="请输入内容" />
        <Input v-model="inputVal" placeholder="禁用输入" disabled />
        <Input v-model="inputVal" placeholder="密码输入" type="password" show-password />
        <Input v-model="inputVal" placeholder="可清空" clearable />
        <Input v-model="inputVal" placeholder="文本域" type="textarea" :rows="3" />
      </div>
    </section>

    <!-- Switch组件演示 -->
    <section class="demo-section">
      <h2>Switch 开关</h2>
      <div class="demo-box">
        <Switch v-model="switchVal" />
        <Switch v-model="switchVal" disabled />
        <Switch v-model="switchVal" active-text="开" inactive-text="关" />
      </div>
    </section>

    <!-- Select组件演示 -->
    <section class="demo-section">
      <h2>Select 选择器</h2>
      <div class="demo-box">
        <Select v-model="inputVal" placeholder="请选择" :options="options" />
        <Select v-model="inputVal" placeholder="可清空" :options="options" clearable />
        <Select v-model="inputVal" placeholder="可搜索" :options="options" filterable />
        <Select v-model="inputVal" placeholder="远程搜索" remote :remote-method="remoteMethod"
          :render-label="renderLabel" />
      </div>
    </section>

    <!-- Dropdown组件演示 -->
    <section class="demo-section">
      <h2>Dropdown 下拉菜单</h2>
      <div class="demo-box">
        <Dropdown :menu-options="menuOptions" @select="handleDropdownSelect">
          <Button>下拉菜单</Button>
        </Dropdown>
      </div>
    </section>

    <!-- Collapse组件演示 -->
    <section class="demo-section">
      <h2>Collapse 折叠面板</h2>
      <div class="demo-box">
        <Collapse v-model="activeNames">
          <CollapseItem v-for="item in collapseItems" :key="item.name" :name="item.name" :title="item.title">
            {{ item.content }}
          </CollapseItem>
        </Collapse>
      </div>
    </section>

    <!-- Tooltip组件演示 -->
    <section class="demo-section">
      <h2>Tooltip 提示框</h2>
      <div class="demo-box">
        <Tooltip content="这是提示信息" placement="top">
          <Button>鼠标悬停</Button>
        </Tooltip>
        <Tooltip content="这是下方提示" placement="bottom">
          <span>另一个提示</span>
        </Tooltip>
      </div>
    </section>

    <!-- Icon组件演示 -->
    <section class="demo-section">
      <h2>Icon 图标</h2>
      <div class="demo-box">
        <Icon icon="check" />
        <Icon icon="close" />
        <Icon icon="question" />
        <Icon icon="info" />
      </div>
    </section>

    <!-- Message组件演示 -->
    <section class="demo-section">
      <h2>Message 消息提示</h2>
      <div class="demo-box">
        <Button @click="showMessage">显示消息</Button>
      </div>
    </section>

    <!-- Form组件演示 -->
    <section class="demo-section">
      <h2>Form 表单</h2>
      <div class="demo-box" style="max-width: 500px;">
        <Form ref="formRef" :model="formModel" :rules="formRules">
          <FormItem label="用户名" prop="username">
            <Input v-model="formModel.username" type="text" />
          </FormItem>
          <FormItem ref="passwordFormItem" label="密码" prop="password">
            <Input v-model="formModel.password" type="password" show-password />
          </FormItem>
          <FormItem label="确认密码" prop="confirmPassword">
            <Input v-model="formModel.confirmPassword" type="password" show-password />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="submitForm">提交</Button>
            <Button @click="() => formRef?.resetFields()">重置</Button>
            <Button @click="() => formRef?.clearValidate()">清除校验</Button>
          </FormItem>
        </Form>
      </div>
    </section>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-container h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.demo-section {
  margin-bottom: 50px;
}

.demo-section h2 {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  color: #555;
}

.demo-box {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

button {
  margin-right: 10px;
}

.as-alert {
  margin-bottom: 10px;
  width: 100%;
}

.as-input {
  width: 200px;
}

.as-select {
  width: 200px;
}

.as-collapse {
  width: 100%;
}

.custom-label {
  color: #409eff;
}
</style>
