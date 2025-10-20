import type { VNode } from 'vue'
export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps {
  modelValue: string
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  renderLabel?: (option: SelectOption) => VNode
  filterable?: boolean
  filterMethod?: (inputValue: string) => SelectOption[]
  remote?: boolean
  remoteMethod?: (inputValue: string) => Promise<SelectOption[]>
}

export interface SelectStates {
  inputValue: string
  selectOption: SelectOption | null
  mouseHover: boolean
  loading: boolean
  heighLightIndex: number
}

export interface SelectEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'visible-change', visible: boolean): void
  (e: 'clear'): void
}
