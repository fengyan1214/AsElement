<script setup lang="ts">
import type { InputExpose } from '../Input/types';
import type { TooltipExpose } from '../ToolTip/types';
import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types'
import Tooltip from '../ToolTip/Tooltip.vue';
import Input from '../Input/Input.vue';
import Icon from '../Icon/Icon.vue';
import RenderVnode from '../Common/RenderVnode';
import { ref, reactive, computed, watch } from 'vue';
defineOptions({
    name: 'AsSelect',
})


const props = withDefaults(defineProps<SelectProps>(), {
    options: () => []
})
const emits = defineEmits<SelectEmits>()

const findOption = (value: string) => {
    return props.options.find((item) => item.value == value)
}
const initialOption = findOption(props.modelValue)
watch(() => props.modelValue, (newVal) => {
    states.selectOption = findOption(newVal) as SelectOption
})
const states = reactive<SelectStates>({
    inputValue: initialOption?.label || '',
    selectOption: initialOption as SelectOption,
    mouseHover: false,
    loading: false,
    heighLightIndex: -1,
})

const itemSelect = (item: SelectOption) => {
    if (item.disabled) {
        return
    }
    states.inputValue = item.label
    states.selectOption = item
    emits('update:modelValue', item.value)
    emits('change', item.value)
    controlDropdown(false)
    InputRef.value?.ref.focus()
}

const tooltipRef = ref<TooltipExpose | null>(null)
const isDropdownShow = ref(false)
const controlDropdown = (show: boolean) => {
    if (show) {
        // 在filter模式下，希望在已经选择过选项的情况下，清空输入框
        if (props.filterable && states.selectOption) {
            states.inputValue = ''
        }
        if (props.filterable) {
            createFilteredOptions()
        }
        tooltipRef.value?.show()
    } else {
        tooltipRef.value?.hide()
        if (props.filterable) {
            states.inputValue = states.selectOption?.label || ''
        }
        states.heighLightIndex = -1
    }
    isDropdownShow.value = show
    emits('visible-change', show)
}
const toggleDropdown = () => {
    if (props.disabled) {
        return
    }
    if (isDropdownShow.value) {
        controlDropdown(false)
    } else {
        controlDropdown(true)
    }
}

const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
        case 'ArrowUp':
            states.heighLightIndex = Math.max(0, states.heighLightIndex - 1)
            break
        case 'ArrowDown':
            states.heighLightIndex = Math.min(filteredOptions.value.length - 1, states.heighLightIndex + 1)
            break
        case 'Enter':
            if (states.heighLightIndex >= 0 && filteredOptions.value[states.heighLightIndex]) {
                itemSelect(filteredOptions.value[states.heighLightIndex])
            }
            else {
                if (!isDropdownShow.value) {
                    controlDropdown(true)
                } else {
                    controlDropdown(false)
                }
            }
            break
        case 'Escape':
            controlDropdown(false)
            break
    }
}

const InputRef = ref<InputExpose | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const popperOptions: any = {
    modifiers: [
        {
            name: 'offset',
            options: {
                offset: [0, 9],
            },
        },
        {
            name: "sameWidth",
            enabled: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any 
            fn: ({ state }: { state: any }) => {
                state.styles.popper.width = `${state.rects.reference.width}px`;
            },
            phase: "beforeWrite",
            requires: ["computeStyles"],
        }
    ],
}

const showClearIcon = computed(() => {
    return states.inputValue !== ''
        && !props.disabled
        && props.clearable
        && states.mouseHover
        && states.selectOption
})
const onClear = () => {
    if (props.disabled) {
        return
    }
    states.inputValue = ''
    states.selectOption = null
    emits('update:modelValue', '')
    emits('change', '')
    emits('clear')
}

const filteredOptions = ref(props.options)
watch(() => props.options, (newVal) => {
    filteredOptions.value = newVal
})
let timer: number | null = null
const createFilteredOptions = async () => {
    states.heighLightIndex = -1
    if (!props.filterable) {
        return
    }
    if (props.filterMethod && typeof props.filterMethod === 'function') {
        filteredOptions.value = props.filterMethod(states.inputValue)
    }
    else if (props.remote && props.remoteMethod && typeof props.remoteMethod === 'function') {
        states.loading = true
        try {
            if (timer != null) {
                clearTimeout(timer)
            }
            timer = setTimeout(async () => {
                if (props.remoteMethod) {
                    filteredOptions.value = await props.remoteMethod(states.inputValue)
                    states.loading = false
                }
            }, 300)
        }
        catch (err) {
            console.error('remoteMethod error', err)
            filteredOptions.value = []
            states.loading = false
        }
    }
    else {
        filteredOptions.value = props.options.filter((item) => item.label.includes(states.inputValue))
    }
}


const filteredPlaceholder = computed(() => {
    if (props.filterable && isDropdownShow.value && states.selectOption) {
        return states.selectOption.label
    }
    else {
        return props.placeholder
    }
})
</script>

<template>
    <div @mouseenter="states.mouseHover = true" @mouseleave="states.mouseHover = false" @click="toggleDropdown"
        class="as-select" :class="{ 'is-disabled': disabled }">
        <Tooltip :popperOptions="popperOptions" manual placement="bottom-start" ref="tooltipRef"
            @click-outside="controlDropdown(false)">
            <Input @keydown="handleKeyDown" @input="createFilteredOptions" ref="InputRef"
                :readonly="!filterable || !isDropdownShow" v-model="states.inputValue" :disabled="disabled"
                :placeholder="filteredPlaceholder">
            <template #suffix>
                <Icon icon="circle-xmark" v-if="showClearIcon" class="as-input__clear" @click.stop="onClear"
                    @mousedown.prevent></Icon>
                <Icon v-else icon="angle-down" class="header-angle" :class="{ 'is-active': isDropdownShow }"></Icon>
            </template>
            </Input>
            <template #content>
                <div class="as-select__loading" v-if="states.loading">
                    <Icon icon="spinner" spin></Icon>
                </div>
                <div class="as-select__nodata" v-else-if="filterable && filteredOptions.length === 0">暂无数据</div>
                <ul v-else class="as-select__menu">
                    <template v-for="(item, index) in filteredOptions" :key="index">
                        <li :id="`select-item-${item.value}`" @click.stop="itemSelect(item)" :class="{
                            'as-select__menu-item': true,
                            'is-disabled': item.disabled,
                            'is-selected': item.value === states.selectOption?.value,
                            'is-highlight': index === states.heighLightIndex
                        }">
                            <RenderVnode :v-node="renderLabel ? renderLabel(item) : item.label"></RenderVnode>
                        </li>
                    </template>
                </ul>
            </template>
        </Tooltip>
    </div>
</template>
