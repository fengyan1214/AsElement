<script setup lang="ts">
import { collapseContextKey } from './types';
import Icon from '../Icon/Icon.vue';
import { computed, inject } from 'vue';
import type { CollapseItemProps } from './types';
defineOptions({
    name: 'AsCollapseItem'
})
const props = defineProps<CollapseItemProps>()

const collapseContext = inject(collapseContextKey);
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))
const handleClick = () => {
    if (props.disabled) {
        return;
    }
    collapseContext?.handleItemClick(props.name);
}

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
    beforeEnter(el) {
        el.style.height = '0px';
    },
    enter(el) {
        el.style.height = `${el.scrollHeight}px`;
    },
    afterEnter(el) {
        el.style.height = '';
    },
    beforeLeave(el) {
        el.style.height = `${el.scrollHeight}px`;
    },
    leave(el) {
        el.style.height = '0px'
    },
    afterLeave(el) {
        el.style.height = '';
    }
}
</script>

<template>
    <div class="as-collapse-item" :class="{
        'is-disabled': disabled
    }">
        <div class="as-collapse-item__header" :class="{
            'is-active': isActive,
            'is-disabled': disabled
        }" :id="`item-header-${name}`" @click="handleClick">
            <!-- 默认显示title -->
            <slot name="title">{{ title }}</slot>
            <Icon icon="angle-right" class="header-angle" />
        </div>
        <Transition v-on="transitionEvents" name="slide">
            <!-- 折叠区域展开需要动画，Transition可以对v-if或者v-show进行动画 -->
            <div v-show="isActive" class="as-collapse-item__content-wrapper">
                <!-- 包裹一层父元素，解决子元素因为下内边距导致的动画高度问题，
                 同时因为有高度过度的是父元素，期间子元素会溢出，需要给父元素设置overflow: hidden; -->
                <div class="as-collapse-item__content" :id="`item-content-${name}`">
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss"></style>