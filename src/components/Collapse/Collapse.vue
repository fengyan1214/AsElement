<script setup lang="ts">
import { collapseContextKey } from './types';
import { provide, ref, watch } from 'vue';
import type { NameType, CollapseProps, CollapseEmits } from './types';

defineOptions({
    name: 'AsCollapse'
})

const props = defineProps<CollapseProps>()
const emit = defineEmits<CollapseEmits>()
// 监听modelValue变化,因为modelValue变化时，activeNames不会自动更新
watch(() => props.modelValue, (newVal) => {
    activeNames.value = newVal;
})

const activeNames = ref<NameType[]>(props.modelValue);
if (props.accordion && activeNames.value.length > 1) {
    console.warn('accordion模式下，只能有一个面板展开')
}
const handleItemClick = (item: NameType) => {
    if (props.accordion) {
        activeNames.value = [activeNames.value[0] === item ? '' : item]
    }
    else {
        const index = activeNames.value.indexOf(item);
        if (index > -1) {
            activeNames.value.splice(index, 1);
        } else {
            activeNames.value.push(item);
        }
    }
    // 避免每次返回相同引用，导致影响上次的结果
    const _activeNames = [...activeNames.value]
    emit('update:modelValue', _activeNames);
    emit('change', _activeNames);
}
provide(collapseContextKey, {
    activeNames,
    handleItemClick
})
</script>

<template>
    <div class="as-collapse">
        <slot></slot>
    </div>
</template>
