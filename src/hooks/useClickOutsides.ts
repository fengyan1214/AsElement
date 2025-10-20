import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'
// 除了指定元素，其他地方点击都触发回调
const useClickOutsides = (
  elementRef: Ref<undefined | HTMLElement>,
  callback: (e: MouseEvent) => void,
) => {
  const handler = (e: MouseEvent) => {
    // 核心逻辑在于判断点击的目标元素是否是指定元素的子元素
    if (elementRef.value && e.target) {
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        callback(e)
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
export default useClickOutsides
