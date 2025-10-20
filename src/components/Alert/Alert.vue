<script setup lang="ts">
import { ref } from 'vue';
import type { AlertProps, AlertExpose } from './types';
import Icon from '../Icon/Icon.vue';
withDefaults(defineProps<AlertProps>(), {
    type: 'info',
    effect: 'light',
    closable: true,
})
const show = ref(true)
const closeAlert = () => {
    show.value = false
}

defineExpose<AlertExpose>({
    close: closeAlert
})

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
    beforeEnter(el) {
        el.style.opacity = '0';
    },
    enter(el) {
        el.style.opacity = '1';
    },
    afterEnter(el) {
        el.style.opacity = '';
    },
    beforeLeave(el) {
        el.style.opacity = '1';
    },
    leave(el) {
        el.style.opacity = '0';
    },
    afterLeave(el) {
        el.style.opacity = '';
    }
}
</script>

<template>
    <Transition v-on="transitionEvents" name="fade">
        <div v-if="show" class="as-alert" :class="{ [`as-alert-${type}`]: type, 'is-dark': effect == 'dark' }">
            <div class="as-alert__content" :style="{ 'justify-content': center ? 'center' : '' }">
                <slot><span>{{ content }}</span></slot>
                <span @click="closeAlert" class="as-alert__close" v-if="closable">
                    <Icon icon="close"></Icon>
                </span>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss"></style>