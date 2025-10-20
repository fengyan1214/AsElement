<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import Schema from 'async-validator';
import { computed, inject, reactive, provide, onMounted, onUnmounted } from 'vue';
import { FormItemContextKey } from './types';
import type { FormItemProps, FormValidateFailure, FormItemContext, FormItemExpose, ValidateStatus } from './types'
import { FormContextKey } from './types';
defineOptions({
    name: 'AsFormItem',
})
const props = defineProps<FormItemProps>()
const formContext = inject(FormContextKey)

const validateStatus = reactive<ValidateStatus>({
    state: 'init',
    errorMessage: '',
    loading: false,
})

let initialValue: any = null

// 获取当前表单项的值和验证规则
const innerValue = computed(() => {
    const model = formContext?.model
    if (model && props.prop && model[props.prop] !== undefined) {
        return model[props.prop]
    } else {
        return null
    }
})
const itemRules = computed(() => {
    const rules = formContext?.rules
    if (rules && props.prop && rules[props.prop]) {
        return rules[props.prop]
    } else {
        return []
    }
})
const required = computed(() => {
    return itemRules.value.some((rule) => rule.required)
})

// 根据传入的trigger筛选出当前表单项符合条件的校验规则
const getTriggeredRules = (trigger?: string) => {
    const rules = itemRules.value
    if (rules) {
        return rules.filter((rule) => {
            if (!rule.trigger || !trigger) {
                return true
            }
            return rule.trigger && rule.trigger === trigger
        })
    } else
        return []
}
// 通过第三方库校验表单
// 调用时会根据传入的trigger校验对应规则
const validate = async (trigger?: string) => {
    // change事件触发后还会触达blur事件，blur事件触发的校验可能会覆盖change事件触发的校验
    const modelName = props.prop
    const triggeredRules = getTriggeredRules(trigger)
    if (triggeredRules.length <= 0) {
        return true
    }

    if (modelName) {
        const validator = new Schema({
            [modelName]: triggeredRules,
        })
        validateStatus.loading = true
        return validator.validate({ [modelName]: innerValue.value }).then(() => {
            validateStatus.state = 'success'
            validateStatus.errorMessage = ''
        }).catch((e: FormValidateFailure) => {
            const { errors } = e
            validateStatus.state = 'error'
            validateStatus.errorMessage = errors?.[0]?.message || ''
            return Promise.reject(e)
        }).finally(() => {
            validateStatus.loading = false
        })
    }
}

const clearValidate = () => {
    validateStatus.state = 'init'
    validateStatus.errorMessage = ''
    validateStatus.loading = false
}

const resetField = () => {
    clearValidate()
    const model = formContext?.model
    if (model && props.prop && model[props.prop] !== undefined) {
        model[props.prop] = initialValue
    }
}

const FormItemContext: FormItemContext = {
    validate,
    prop: props.prop || '',
    resetField,
    clearValidate,
}
provide(FormItemContextKey, FormItemContext)


onMounted(() => {
    if (props.prop) {
        formContext?.addField(FormItemContext)
    }
    initialValue = innerValue.value
})
onUnmounted(() => {
    if (props.prop) {
        formContext?.removeField(FormItemContext)
    }
})
defineExpose<FormItemExpose>({
    validate,
    resetField,
    clearValidate,
    validateStatus,
})
</script>

<template>
    <div class="as-form-item" :class="{
        'is-success': validateStatus.state === 'success',
        'is-error': validateStatus.state === 'error',
        'is-loading': validateStatus.loading,
        'is-required': required
    }">
        <label v-if="label" class="as-form-item__label">
            <slot name="label" :label="label">{{ label }}</slot>
        </label>
        <div class="as-form-item__content">
            <slot :validate="validate"></slot>
            <div class="as-form-item__error-msg" v-if="validateStatus.state === 'error'">
                {{ validateStatus.errorMessage }}
            </div>
        </div>
    </div>
</template>