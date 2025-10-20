<script setup lang="ts">
import Icon from '../Icon/Icon.vue';
import { ref } from 'vue';
import type { ButtonProps } from './types';

defineOptions({
    name: 'AsButton'
})
withDefaults(defineProps<ButtonProps>(), {
    nativeType: 'button'
})
const _ref = ref<HTMLButtonElement>()
defineExpose({
    ref: _ref
})
</script>
<template>
    <button ref="_ref" class="as-button" :class="{
        [`as-button-${type}`]: true,
        [`as-button-${size}`]: true,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'is-disabled': disabled,
        'is-loading': loading
    }" :disabled="disabled || loading" :autofocus="autoFocus" :type="nativeType">
        <Icon v-if="loading" icon="spinner" spin />
        <Icon v-if="icon" :icon="icon" />
        <span>
            <!-- 默认插槽插入文字 -->
            <slot></slot>
        </span>
    </button>
</template>

<style scoped></style>