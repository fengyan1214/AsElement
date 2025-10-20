<script setup lang="ts">
import { provide } from 'vue'
import type { FormProps, FormItemContext, FormValidateFailure, FormExpose } from './types'
import { FormContextKey } from './types';
import type { ValidateFieldsError } from 'async-validator';
defineOptions({
    name: 'AsForm',
})
const props = defineProps<FormProps>()

const fields: FormItemContext[] = []
const addField = (field: FormItemContext) => {
    fields.push(field)
}
const removeField = (field: FormItemContext) => {
    const index = fields.indexOf(field)
    if (index !== -1) {
        fields.splice(index, 1)
    }
}

const validate = async () => {
    const validationErrors: ValidateFieldsError = {}
    for (const field of fields) {
        try {
            // 对每个表单项执行全部的校验
            await field.validate('')
        } catch (e) {
            const error = e as FormValidateFailure
            if (error.errors) {
                validationErrors[field.prop] = error.errors
            }
        }
    }
    if (Object.keys(validationErrors).length === 0) {
        return true
    }
    return Promise.reject(validationErrors)
}
// 清除全部或指定表单项的状态
const resetFields = (keys: string[] = []) => {
    const filterFields = keys.length ? fields.filter(field => keys.includes(field.prop)) : fields
    for (const field of filterFields) {
        field.resetField()
    }
}
const clearValidate = (keys: string[] = []) => {
    const filterFields = keys.length ? fields.filter(field => keys.includes(field.prop)) : fields
    for (const field of filterFields) {
        field.clearValidate()
    }
}

defineExpose<FormExpose>({
    validate,
    resetFields,
    clearValidate,
})

provide(FormContextKey, {
    ...props,
    addField,
    removeField,
})
</script>

<template>
    <form class="as-form">
        <slot></slot>
    </form>
</template>
