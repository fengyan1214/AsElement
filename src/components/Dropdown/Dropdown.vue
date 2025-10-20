<script setup lang="ts">
import { ref } from "vue";
import type { TooltipExpose } from "../ToolTip/types";
import type { DropdownExpose, DropdownEmits, DropdownProps, MenuOption } from "./types";
import Tooltip from "../ToolTip/Tooltip.vue";
import RenderVnode from "../Common/RenderVnode";

const props = withDefaults(defineProps<DropdownProps>(), {
    hideAfterClick: true,
})
const emits = defineEmits<DropdownEmits>()

const tooltipRef = ref<TooltipExpose>()
defineExpose<DropdownExpose>({
    show: () => tooltipRef.value?.show(),
    hide: () => tooltipRef.value?.hide(),
})

const visibleChange = (visible: boolean) => {
    emits('visible-change', visible)
}

const itemClick = (item: MenuOption) => {
    if (!item.disabled) {
        emits('select', item)
        if (props.hideAfterClick) {
            tooltipRef.value?.hide()
        }
    }

}
</script>

<template>
    <div class="as-dropdown">
        <Tooltip :trigger="trigger" :popper-options="popperOptions" :placement="placement" :closeDelay="closeDelay"
            :openDelay="openDelay" @visible-change="visibleChange" ref="tooltipRef">
            <slot></slot>
            <template #content>
                <ul class="as-dropdown__menu">
                    <template v-for="item in menuOptions" :key="item.key">
                        <li v-if="item.divided" role="separator" class="divided-placeholder">
                        </li>
                        <li @click="itemClick(item)" class="as-dropdown__item"
                            :class="{ 'is-disabled': item.disabled, 'is-divided': item.disabled }"
                            :id="`dropdown__item-${item.key}`">
                            <RenderVnode :vNode="item.label"></RenderVnode>
                        </li>
                    </template>
                </ul>
            </template>
        </Tooltip>
    </div>
</template>
