<script setup lang="ts">
import useEventListener from '@/hooks/useEventListener';
import { getLastBottomOffset } from './method';
import Icon from '../Icon/Icon.vue';
import RenderVnode from '../Common/RenderVnode';
import type { MessageProps } from './types';
import { computed, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<MessageProps>(), {
    duration: 3000,
    type: 'info',
    offset: 20,
    transitionName: 'fade-up'
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
const startTimer = () => {
    if (props.duration == 0) {
        // 时长为0表示永不关闭
        return
    }

    timer = setTimeout(() => {
        visible.value = false;
    }, props.duration);
}
const clearTimer = () => {
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
}


const messageRef = ref<HTMLDivElement | null>(null)
// 当前消息的高度
const height = ref(0)
// computed必须包含响应式对象的计算才会拥有响应式特性，因此此处掉用的函数也必须包含响应式对象的计算
// 上一个消息的bottom所在坐标
const lastOffset = computed(() => {
    return getLastBottomOffset(props.id!)
})
// 当前消息的top
const top = computed(() => {
    return lastOffset.value + props.offset
})
// 当前消息为下一条消息预留的bottom坐标
const bottomOffset = computed(() => {
    return top.value + height.value
})
const cssStyle = computed(() => {
    return {
        top: `${top.value}px`,
        'z-index': props.zIndex
    }
})
onMounted(async () => {
    visible.value = true;
    startTimer();
})
const close = () => {
    visible.value = false;
}
useEventListener(document, 'keydown', (e) => {
    const event = e as KeyboardEvent
    if (event.code === 'Escape') {
        close()
    }
})
defineExpose({
    bottomOffset,
    close,
})
</script>

<template>
    <Transition @after-leave="onDestroy" @enter="height = messageRef!.getBoundingClientRect().height"
        :name="transitionName">
        <div @mouseenter="clearTimer" @mouseleave="startTimer" ref="messageRef" :style="cssStyle" v-show="visible"
            class="as-message" :class="{ ['as-message-' + type]: type, 'is-close': showClose }">
            <div class="as-message__content">
                <slot>
                    <RenderVnode :vNode="message" v-if="message"></RenderVnode>
                </slot>
            </div>
            <div class="as-message__close" v-if="showClose">
                <Icon @click.stop="visible = false" icon="xmark"></Icon>
            </div>
        </div>
    </Transition>
</template>
