import { computed, ref } from 'vue'

const zIndex = ref(0)
const useZIndex = (initialValue = 2000) => {
  const initialZIndex = ref(initialValue)
  const currenZIndex = computed(() => {
    return initialZIndex.value + zIndex.value
  })
  const nextZIndex = () => {
    zIndex.value++
    return currenZIndex.value
  }
  return {
    currenZIndex,
    nextZIndex,
    initialZIndex,
  }
}
export default useZIndex
