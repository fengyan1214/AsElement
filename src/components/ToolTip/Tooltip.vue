<script setup lang="ts">
// 使用popperjs创建Popper实例,可以方便的实现展示区的绝对定位
import { computed, onUnmounted, reactive, ref, watch } from 'vue';
import type { Instance } from '@popperjs/core';
import { createPopper } from '@popperjs/core';
import type { TooltipProps, TooltipEmits, TooltipExpose } from './types';
import useClickOutsides from '@/hooks/useClickOutsides'

type Timeout = NodeJS.Timeout
const props = withDefaults(defineProps<TooltipProps>(), {
    placement: 'bottom',
    transition: 'fade',
    trigger: 'hover',
    openDelay: 0,
    closeDelay: 0
})
const emit = defineEmits<TooltipEmits>()

const popperOptions = computed(() => {
    return {
        placement: props.placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 9]
                }
            }
        ],
        ...props.popperOptions,
    }
})

// 是否显示展示区
const isOpen = ref(false)

const triggerNode = ref<HTMLElement>()
const popperNode = ref<HTMLElement>()
const popperContainerNode = ref<HTMLElement>()

let popperInstance: null | Instance = null

watch(isOpen, (newValue) => {
    // 当展示区显示时，创建Popper实例
    if (newValue) {
        if (triggerNode.value && popperNode.value) {
            popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
        }
    }
}, { flush: 'post' })
onUnmounted(() => {
    popperInstance?.destroy()
})

let openTimer: Timeout | null | number = null
let closeTimer: Timeout | null | number = null

const togglePopper = () => {
    if (isOpen.value) {
        closePopper()
    } else {
        openPopper()
    }
}
const openPopper = () => {
    if (closeTimer) {
        clearTimeout(closeTimer)
    }
    if (openTimer) {
        clearTimeout(openTimer)
    }
    openTimer = setTimeout(() => {
        openTimer = null
        isOpen.value = true
        emit('visible-change', true)

    }, props.openDelay)
}
const closePopper = () => {
    if (openTimer) {
        clearTimeout(openTimer)
    }
    if (closeTimer) {
        clearTimeout(closeTimer)
    }
    closeTimer = setTimeout(() => {
        closeTimer = null
        isOpen.value = false
        emit('visible-change', false)
    }, props.closeDelay)
}
// 点击外部关闭popper，其实也可以阻止容器的事件冒泡解决
useClickOutsides(popperContainerNode, () => {
    if (isOpen.value && props.trigger == 'click' && !props.manual) {
        closePopper()
    }
    emit('click-outside')
})


let events: Record<string, () => void> = reactive({})
let outerEvents: Record<string, () => void> = reactive({})
const attachEvents = () => {
    // 根据不同的模式添加不同的事件
    if (props.trigger == 'click') {
        events['click'] = togglePopper
    }
    if (props.trigger == 'hover') {
        events['mouseenter'] = openPopper
        outerEvents['mouseleave'] = closePopper
    }
}
// 手动模式下不做事件初始化
if (!props.manual) {
    attachEvents()
}
watch(() => props.manual, (newVal) => {
    if (newVal) {
        // 手动模式下，移除所有事件
        events = {}
        outerEvents = {}
    } else {
        // 非手动模式下，重新绑定事件
        attachEvents()
    }

})


// 监听trigger变化，重新绑定事件
watch(() => props.trigger, (newVal, oldVal) => {
    if (newVal != oldVal) {
        // trigger变化时，决定展示区的逻辑要重新绑定
        events = {}
        outerEvents = {}
        attachEvents()
    }
})

defineExpose<TooltipExpose>({
    show: openPopper,
    hide: closePopper
})
</script>

<template>
    <div v-on="outerEvents" class="as-tooltip" ref="popperContainerNode">
        <!-- 触发区 -->
        <div v-on="events" class="as-tooltip__trigger" ref="triggerNode">
            <slot></slot>
        </div>
        <!-- 展示区 -->
        <!-- 动画结束后注意销毁popperInstance实例 -->
        <Transition :name="transition" @after-leave="popperInstance?.destroy()"
            @leave-cancelled="popperInstance?.destroy()">
            <div v-if="isOpen" class="as-tooltip__popper" ref="popperNode">
                <slot name="content">{{ content }}</slot>
                <div id="arrow" data-popper-arrow></div>
            </div>
        </Transition>
    </div>
</template>