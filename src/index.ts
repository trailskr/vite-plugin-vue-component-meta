import type { ModuleNode, Plugin, ResolvedConfig } from 'vite'
import type { UserOptions } from './options'

import { resolve } from 'node:path'
import { normalizePath } from 'vite'
import { getFilesFromPath } from './files'
import { getClientCode } from './getClientCode'
import { resolveOptions } from './options'
import { debug, resolveDirs } from './utils'

export type { UserOptions } from './options'

const MODULE_ID = 'virtual:vue-meta'
const MODULE_ID_VIRTUAL = '/@vite-plugin-vue-component-meta/vue-meta'

export const vueComponentMeta = (userOptions: UserOptions = {}): Plugin => {
  const options = resolveOptions(userOptions)

  let config: ResolvedConfig
  let componentsDirs: string[]

  return {
    name: 'vite-plugin-vue-component-meta',
    enforce: 'pre',
    configResolved(conf) {
      config = conf
      componentsDirs = resolveDirs(options.componentsDirs, config.root)
    },
    configureServer({ moduleGraph, watcher, ws }) {
      watcher.add(options.componentsDirs)

      const reloadModule = (module: ModuleNode, path = '*') => {
        moduleGraph.invalidateModule(module)
        ws?.send({
          path,
          type: 'full-reload',
        })
      }

      const updateVirtualModule = (path: string) => {
        path = normalizePath(resolve(config.root, path))
        debug('watcher %s', path)
        debug('dirs %o', componentsDirs)
        if (!componentsDirs.some((dir) => path.startsWith(dir))) return
        debug('reload %s', path)
        const module = moduleGraph.getModuleById(MODULE_ID_VIRTUAL)
        if (module) reloadModule(module)
      }

      watcher.on('add', updateVirtualModule)
      watcher.on('unlink', updateVirtualModule)
      watcher.on('change', updateVirtualModule)
    },
    resolveId(id) {
      return id.startsWith(MODULE_ID)
        ? MODULE_ID_VIRTUAL
        : null
    },
    async load(id) {
      if (id !== MODULE_ID_VIRTUAL) return
      const files: string[] = []

      for (const dir of componentsDirs) {
        const path = dir[0] === '/'
          ? normalizePath(dir)
          : normalizePath(resolve(config.root, dir))

        debug('Loading Components Dir: %s', path)

        files.push(...await getFilesFromPath(path, options))

        debug('Done loading Components Dir: %s', path)
      }

      debug('Generating client code')
      return getClientCode(files, options.tsConfigPath, options.metaCheckerOptions)
    },
  }
}

export const VueComponentMeta = vueComponentMeta

// eslint-disable-next-line import/no-default-export
export default vueComponentMeta
