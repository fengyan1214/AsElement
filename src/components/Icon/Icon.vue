<!-- 对font-awesome-icon组件的封装 -->
<script setup lang="ts">
import type { FontAwesomeIconProps } from "@fortawesome/vue-fontawesome";
import type { IconProps } from "./types";
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { computed } from "vue";
const props = defineProps<FontAwesomeIconProps & IconProps>()

defineOptions({
    name: 'AsIcon',
    inheritAttrs: false
})
const filterProps = computed(() => Object.fromEntries(Object.entries(props).filter(([key]) => !['type', 'color'].includes(key))) as unknown as FontAwesomeIconProps)

const customStyle = computed(() => {
    if (props.color) {
        return {
            color: props.color
        }
    } else {
        return {}
    }
})
</script>

<template>
    <i class="as-icon" :class="{ [`as-icon--${type}`]: type }" :style="customStyle" v-bind="$attrs">
        <font-awesome-icon v-bind="filterProps" />
    </i>
</template>
