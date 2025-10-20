import type { VNode } from 'vue'
import type { TooltipProps } from '../ToolTip/types'
export interface DropdownProps extends TooltipProps {
  menuOptions: MenuOption[]
  hideAfterClick?: boolean
}
export interface MenuOption {
  label: string | VNode
  key: string | number
  disabled?: boolean
  divided?: boolean
}
export interface DropdownEmits {
  (e: 'select', value: MenuOption): void
  (e: 'visible-change', visible: boolean): void
}
export interface DropdownExpose {
  show: () => void
  hide: () => void
}
