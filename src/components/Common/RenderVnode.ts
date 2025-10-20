import { defineComponent } from 'vue'

const RenderVnode = defineComponent({
  props: {
    vNode: {
      type: [Object, String],
      default: () => {},
    },
  },
  setup(props) {
    return () => props.vNode
  },
})
export default RenderVnode
