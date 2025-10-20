import type { Placement, Options } from '@popperjs/core'
export interface TooltipProps {
  placement?: Placement
  trigger?: 'hover' | 'click'
  content?: string
  manual?: boolean
  popperOptions?: Partial<Options>
  transition?: string
  openDelay?: number
  closeDelay?: number
}
export interface TooltipEmits {
  (e: 'visible-change', value: boolean): void
  (e: 'click-outside'): void
}
export interface TooltipExpose {
  show: () => void
  hide: () => void
}
