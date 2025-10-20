export type valueType = boolean | string | number
export interface SwitchProps {
  modelValue: valueType
  activeValue?: valueType
  inactiveValue?: valueType
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  name?: string
  id?: string
  size?: 'large' | 'small'
}
export interface SwitchEmits {
  (e: 'update:modelValue', value: valueType): void
  (e: 'change', value: valueType): void
}
