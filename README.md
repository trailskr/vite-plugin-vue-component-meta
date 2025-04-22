# vite-plugin-vue-component-meta

[![npm version](https://img.shields.io/npm/v/vite-plugin-vue-component-meta)](https://www.npmjs.com/package/vite-plugin-vue-component-meta)

> Automatic vue components meta generator using [Vite](https://github.com/vitejs/vite)

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
import componentMeta from 'vite-plugin-vue-component-meta'

export default defineConfig({
  plugins: [
    vue(),
    componentMeta(),
  ],
})
```

Now you can import meta components of your vue components in `src/components` dir.
For example we have component in `src/components/some/my-component.vue`.
You can get it meta like this:

```ts
// src/some.ts
import metaMap from 'virtual:vue-meta'

const meta = metaMap.MyComponent
```

## Client Types

If you want type definition of `virtual:vue-meta`, add `vite-plugin-vue-component-meta/client` to `compilerOptions.types` of your `tsconfig`:

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
   * Relative path to the directory to search for page components.
   * @default 'src/components'
   */
  componentsDirs?: string | string[]
  /**
   * Valid file extensions for page components.
   * @default ['vue']
   */
  extensions?: string[]
  /**
   * List of path globs to exclude when resolving pages.
   */
  exclude?: string[]
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
import componentMeta from 'vite-plugin-vue-component-meta'

export default defineConfig({
  plugins: [
    vue(),
    componentMeta({
      componentsDirs: ['src/ui', 'src/ui2'],
      extensions: ['vue', 'tsx', 'jsx'],
      exclude: ['src/ui/misc'],
      tsConfigPath: 'tsconfig.app.json',
      metaCheckerOptions: {
        forceUseTs: false,
      }
    }),
  ],
})
```
