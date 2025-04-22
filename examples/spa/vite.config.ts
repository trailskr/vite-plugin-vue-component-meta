import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import componentMeta from 'vite-plugin-vue-component-meta'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    vue(),
    componentMeta(),
  ],
})
