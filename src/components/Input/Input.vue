<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch, inject } from 'vue'
import type { InputProps, InputEmits } from './types'
import Icon from '../Icon/Icon.vue';

// 和表单配合，触发指定事件后校验相应规则
import { FormItemContextKey } from '../Form/types';
const FormItemContext = inject(FormItemContextKey)
const runValidate = (trigger?: string) => {
    FormItemContext?.validate(trigger).catch(() => { })
}

defineOptions({
    name: 'AsInput',
    inheritAttrs: false,
})
const props = withDefaults(defineProps<InputProps>(), {
    type: 'text',
    autocomplete: 'off',
})
const emits = defineEmits<InputEmits>()
const attrs = useAttrs()

const innerValue = ref(props.modelValue)
watch(() => props.modelValue, (value) => {
    innerValue.value = value
})
const handleInput = () => {
    emits('update:modelValue', innerValue.value)
    emits('input', innerValue.value)
    runValidate('input')
}
const handleChange = () => {
    emits('change', innerValue.value)
    runValidate('change')
}
const handleFocus = (event: FocusEvent) => {
    isFocus.value = true
    emits('focus', event)
}
const handleBlur = (event: FocusEvent) => {
    isFocus.value = false
    runValidate('blur')
    emits('blur', event)
}
const handlePasswordChange = () => {
    passwordVisible.value = !passwordVisible.value
    nextTick(() => {
        inputRef.value?.focus()
    })
}

const isFocus = ref(false)
const showClear = computed(() => {
    return isFocus.value && !props.disabled && props.clearable && !!innerValue.value
})
const clear = () => {
    emits('update:modelValue', '')
    emits('input', '')
    emits('change', '')
    emits('clear')
}

const showPasswordChange = computed(() => {
    return props.showPassword && !props.disabled && !!innerValue.value
})
const passwordVisible = ref(false)

const inputRef = ref<HTMLInputElement | null>()
defineExpose({
    ref: inputRef
})
</script>

<template>
    <div class="as-input" :class="{
        'is-disabled': disabled,
        [`as-input-${type}`]: type,
        [`as-input-${size}`]: size,
        'is-prepend': $slots.prepend,
        'is-append': $slots.append,
        'is-prefix': $slots.prefix,
        'is-suffix': $slots.suffix,
        'is-focus': isFocus,
    }">
        <!-- input -->
        <template v-if="type !== 'textarea'">
            <!-- prepend插槽 -->
            <div v-if="$slots.prepend" class="as-input__prepend">
                <slot name="prepend"></slot>
            </div>
            <div class="as-input__wrapper">
                <!-- prefix插槽 -->
                <span v-if="$slots.prefix" class="as-input__prefix">
                    <slot name="prefix"></slot>
                </span>
                <!-- input输入框 -->
                <input ref="inputRef" @input="handleInput" v-model="innerValue" class="as-input__inner" v-bind="attrs"
                    :type="showPassword ? (passwordVisible ? 'text' : 'password') : type" :disabled="disabled"
                    @focus="handleFocus" @blur="handleBlur" @change="handleChange" :placeholder="placeholder"
                    :readonly="readonly" :autocomplete="autocomplete" :autofocus="autoFocus" :form="form" />
                <!-- suffix插槽 -->
                <span v-if="$slots.suffix || showClear || showPasswordChange" class="as-input__suffix">
                    <slot name="suffix"></slot>
                    <Icon icon="circle-xmark" v-if="showClear" class="as-input__clear" @click="clear"
                        @mousedown.prevent></Icon>
                    <Icon v-if="showPasswordChange" :icon="passwordVisible ? 'eye' : 'eye-slash'"
                        class="as-input__password" @click="handlePasswordChange"></Icon>
                </span>
            </div>
            <!-- append插槽 -->
            <div v-if="$slots.append" class="as-input__append">
                <slot name="append"></slot>
            </div>
        </template>
        <!-- textarea -->
        <template v-if="type === 'textarea'">
            <textarea @input="handleInput" ref="inputRef" v-model="innerValue" class="as-textarea__wrapper"
                :disabled="disabled" v-bind="attrs" @focus="handleFocus" @blur="handleBlur" @change="handleChange"
                :placeholder="placeholder" :readonly="readonly" :autocomplete="autocomplete" :autofocus="autoFocus"
                :form="form">
            </textarea>
        </template>
    </div>
</template>

<style scoped lang="scss"></style>