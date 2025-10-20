export type ButtonType = 'primary' | 'success' | 'info' | 'warning' | 'danger'
export type ButtonSize = 'large' | 'small'
// button原生的type
export type NativeType = 'button' | 'submit' | 'reset'

export type ButtonInstance = {
  ref: HTMLButtonElement | null
}

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  nativeType?: NativeType
  autoFocus?: boolean
  icon?: string
  loading?: boolean
}
