import type { InjectionKey, Ref } from 'vue'

export type NameType = string | number
export interface CollapseItemProps {
  title?: string
  name: NameType
  disabled?: boolean
}

export interface CollapseContext {
  activeNames: Ref<NameType[]>
  handleItemClick: (item: NameType) => void
}
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('collapseContextKey')

export interface CollapseProps {
  modelValue: NameType[]
  accordion?: boolean
}
export interface CollapseEmits {
  (e: 'update:modelValue', value: NameType[]): void
  (e: 'change', value: NameType[]): void
}
