declare module 'virtual:vue-meta' {
  import type { ComponentMeta } from 'vue-component-meta'

  const metaMap: Record<string, ComponentMeta>

  export default metaMap
}
