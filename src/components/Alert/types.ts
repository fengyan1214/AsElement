export interface AlertProps {
  type?: 'primary' | 'success' | 'info' | 'warning' | 'danger'
  content?: string
  effect?: 'dark' | 'light'
  closable?: boolean
  center?: boolean
}
export interface AlertExpose {
  close: () => void
}
