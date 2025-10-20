// 用于自动处理ref对象或普通事件目标的事件监听和解绑
import { onBeforeUnmount, onMounted, isRef, watch, unref } from 'vue'
import type { Ref } from 'vue'
export default function useEventListener(
  target: Ref<EventTarget | null> | EventTarget,
  event: string,
  handler: (e: Event) => void,
) {
  if (isRef(target)) {
    watch(target, (newVal, oldVal) => {
      newVal?.addEventListener(event, handler)
      oldVal?.removeEventListener(event, handler)
    })
  } else {
    onMounted(() => {
      target.addEventListener(event, handler)
    })
  }
  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(event, handler)
  })
}
