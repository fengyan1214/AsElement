/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InjectionKey } from 'vue'
import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator'

export interface FormItemRule extends RuleItem {
  trigger?: string
}
export type FormRules = Record<string, FormItemRule[]>

export interface FormValidateFailure {
  errors: ValidateError[] | null
  fields: ValidateFieldsError
}

export interface FormItemProps {
  label?: string
  prop?: string
}

export interface FormProps {
  model: Record<string, any>
  rules: FormRules
}

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void
  removeField: (field: FormItemContext) => void
}
export const FormContextKey: InjectionKey<FormContext> = Symbol('FormContext')

export interface FormItemContext {
  validate: (trigger?: string) => Promise<any>
  prop: string
  resetField: () => void
  clearValidate: () => void
}
export const FormItemContextKey: InjectionKey<FormItemContext> = Symbol('FormItemContext')

export interface FormExpose {
  validate: () => Promise<any>
  resetFields: (keys?: string[]) => void
  clearValidate: (keys?: string[]) => void
}

export interface ValidateStatus {
  state: 'init' | 'success' | 'error'
  errorMessage: string | null
  loading: boolean
}
export interface FormItemExpose {
  validate: () => Promise<any>
  resetField: () => void
  clearValidate: () => void
  validateStatus: ValidateStatus
}
