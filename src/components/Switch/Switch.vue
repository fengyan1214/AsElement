<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { SwitchProps, SwitchEmits } from './types';
defineOptions({
    name: 'AsSwitch',
    inheritAttrs: false,
})
const props = withDefaults(defineProps<SwitchProps>(), {
    activeValue: true,
    inactiveValue: false,
})
const emits = defineEmits<SwitchEmits>()

const innerValue = ref(props.modelValue)
watch(() => props.modelValue, (newVal) => {
    innerValue.value = newVal
})

const checked = computed(() => innerValue.value === props.activeValue)
const switchValue = () => {
    if (props.disabled) return
    innerValue.value = innerValue.value === props.activeValue ? props.inactiveValue : props.activeValue
    emits('update:modelValue', innerValue.value)
    emits('change', innerValue.value)
}
const inputRef = ref<HTMLInputElement>()
onMounted(() => {
    inputRef.value!.checked = checked.value
})
watch(checked, (newVal) => {
    inputRef.value!.checked = newVal
})

</script>

<template>
    <div class="as-switch" :class="{
        [`as-switch-${size}`]: true,
        'is-checked': checked,
        'is-disabled': disabled,
    }" @click="switchValue">
        <input @keydown.enter="switchValue" ref="inputRef" checked type="checkbox" class="as-switch__input"
            role="switch" :name="name" :disabled="disabled">
        <div class="as-switch__core">
            <div class="as-switch__core-inner">
                <span class="as-switch__core-inner-test" v-if="activeText || inactiveText">
                    {{ checked ? activeText : inactiveText }}
                </span>
            </div>
            <div class="as-switch__core-action"></div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>