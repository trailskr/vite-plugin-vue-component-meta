# vite-plugin-vue-component-meta

[![npm version](https://img.shields.io/npm/v/vite-plugin-vue-component-meta)](https://www.npmjs.com/package/vite-plugin-vue-component-meta)

> Plugin that generates Vue components meta data using [vue-component-meta](https://github.com/vuejs/language-tools/tree/master/packages/component-meta)

## Getting Started

Install Vue Component Meta:

```bash
$ npm install -D vite-plugin-vue-component-meta
```

Add to your `vite.config.js`:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueComponentMeta from 'vite-plugin-vue-component-meta'

export default defineConfig({
  plugins: [
    vue(),
    vueComponentMeta(),
  ],
})
```

Ensure you have .vue file type shim like this to vue-component-meta

```ts
// src/shims.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, unknown>
  export default component
}
```

Now you can import meta components of your vue components in `src/components` dir.
For example we have component in `src/components/some/my-component.vue`.
You can get it meta like this:

```ts
// src/some.ts
import { meta as myOtherComponentMeta } from './components/my-other-component.vue-meta'
import myComponentMeta from './components/MyComponent.vue-meta'

console.log(myComponentMeta)
console.log(myOtherComponentMeta.props)

// meta is shallow reactive object
watch(myOtherComponentMeta, () => {
  console.log('update')
})
```

## Client Types

If you want type definition of `.vue-meta` files, add `vite-plugin-vue-component-meta/client` to `compilerOptions.types` of your `tsconfig`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vite-plugin-vue-component-meta/client"]
  }
}
```

## Configuration

```ts
interface UserOptions {
  /**
   * tsconfig path passed to vue-component-meta checker, default is './tsconfig.json'
   */
  tsConfigPath?: string
  /**
   * vue-component-meta MetaCheckerOptions,
   * default is: {
   *   forceUseTs: true,
   *   printer: { newLine: NewLineKind.LineFeed },
   * }
   */
  metaCheckerOptions?: MetaCheckerOptions
}
```

### Using configuration

To use custom configuration, pass your options to ComponentsMeta when instantiating the plugin:

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueComponentMeta from 'vite-plugin-vue-component-meta'

export default defineConfig({
  plugins: [
    vue(),
    vueComponentMeta({
      tsConfigPath: 'tsconfig.app.json',
      metaCheckerOptions: {
        forceUseTs: false,
      }
    }),
  ],
})
```
