import { render, h, shallowReactive } from 'vue'
import type { createMessageProps, MessageContext } from './types'
import MessageConstructor from './Message.vue'
import useZIndex from '@/hooks/useZIndex'

const instances: MessageContext[] = shallowReactive([])
let seed = 1
export function createMessage(props: createMessageProps) {
  const id = `message_${seed++}`
  const container = document.createElement('div')
  const { nextZIndex } = useZIndex()
  // 销毁函数,组件内部决定何时销毁
  const destroy = () => {
    render(null, container)
    const index = instances.findIndex((item) => item.id === id)
    if (index !== -1) {
      instances.splice(index, 1)
    }
  }
  // 关闭当前消息，组件实例的接受者可以手动关闭
  const close = () => {
    const ins = instances.find((item) => item.id === id)
    if (ins) {
      ins.vm.exposed!.close()
    }
  }
  // 把销毁函数传入组件，可在组件内部选择特定的时期进行销毁
  const newProps = {
    ...props,
    id,
    onDestroy: destroy,
    zIndex: nextZIndex(),
  }
  const vnode = h(MessageConstructor, newProps)
  render(vnode, container)
  // vm必须在组件创建后才有值，也就是render之后
  // 因此，instance只能在render之后才能插入数组，但这会使组件在创建后无法正常调用getLastBottomOffset，数组中找不到它自己的instance
  // 这就需要依赖响应式对象包裹instances数组，当数组更新后，组件可以获取更新后的数据
  const vm = vnode.component!
  document.body.appendChild(container.firstElementChild!)
  const instance: MessageContext = {
    id,
    vnode,
    props: newProps,
    vm,
    close,
  }
  instances.push(instance)
  return instance
}
export function getLastInstance() {
  return instances.at(-1)
}
export function getLastBottomOffset(id: string) {
  // 根据id获取id对应消息的上一条消息暴露出的bottom偏移量
  const index = instances.findIndex((item) => item.id === id)
  if (index <= 0) return 0
  else {
    return instances[index - 1].vm.exposed!.bottomOffset.value
  }
}
