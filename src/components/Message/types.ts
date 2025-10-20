import type { VNode, ComponentInternalInstance } from 'vue'
export interface MessageProps {
  message?: string | VNode
  duration?: number
  showClose?: boolean
  type?: 'success' | 'danger' | 'warning' | 'info'
  onDestroy: () => void
  offset?: number
  id?: string
  zIndex: number
  transitionName?: string
}
// 销毁函数自动生成，不需要手动传入，可忽略
export type createMessageProps = Omit<MessageProps, 'onDestroy' | 'id' | 'zIndex'>
export interface MessageContext {
  id: string
  vnode: VNode
  props: MessageProps
  vm: ComponentInternalInstance
  close: () => void
}
