/* eslint-disable no-restricted-globals */
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { UserOptions } from './options'

import { dirname, relative } from 'node:path'
import Debug from 'debug'
import { normalizePath } from 'vite'
import { createChecker } from 'vue-component-meta'
import { resolveOptions } from './options'

export type { UserOptions } from './options'

export const relativeNorm = (...args: Parameters<typeof relative>) => {
  return normalizePath(relative(...args))
}

export const debug = Debug('vite-plugin-vue-component-meta')

const virtualModuleSuffix = '.vue-meta'
const virtualModuleSuffixLen = virtualModuleSuffix.length

export const vueComponentMeta = (userOptions: UserOptions = {}): Plugin => {
  const options = resolveOptions(userOptions)
  debug('Resolved options %O', options)

  let config: ResolvedConfig
  let checker: ReturnType<typeof createChecker>
  let tsConfigDir: string
  let devServer: ViteDevServer

  return {
    name: 'vite-plugin-vue-component-meta',
    configResolved(conf) {
      config = conf
    },
    configureServer(server) {
      devServer = server
      const { watcher, moduleGraph, hot } = server
      debug('Creating meta checker using %o with options: %O', options.tsConfigPath, options.metaCheckerOptions)
      checker = createChecker(options.tsConfigPath, options.metaCheckerOptions)
      tsConfigDir = normalizePath(dirname(options.tsConfigPath))
      debug('tsconfig dir %o', tsConfigDir)

      watcher.on('change', (path: string) => {
        const resolvedPath = relativeNorm(config.root, path)
        debug('Change %o', resolvedPath)
        const metaVirtualModuleId = `${resolvedPath}${virtualModuleSuffix}`
        debug('Meta module file %o', metaVirtualModuleId)
        const module = moduleGraph.getModuleById(metaVirtualModuleId)
        if (!module) return

        checker.clearCache()
        debug('Reload %o', metaVirtualModuleId)
        moduleGraph.invalidateModule(module, undefined, undefined, true)
        const url = `/@id/${metaVirtualModuleId}`
        hot.send({
          type: 'update',
          updates: [{
            type: 'js-update',
            timestamp: Date.now(),
            path: url,
            acceptedPath: url,
          }],
        })
      })
    },
    async resolveId(id, importer) {
      if (!id.endsWith(virtualModuleSuffix)) return null
      debug('Resolving module id %o from %o', id, importer)
      const vueModuleId = `${id.slice(0, -virtualModuleSuffixLen)}.vue`
      debug('Vue module id %o', vueModuleId)
      const resolved = await this.resolve(vueModuleId, importer)
      const path = resolved?.id.split('?')?.[0]
      if (!path) {
        debug('Vue module id %o is not found', vueModuleId)
        return null
      }
      debug('Watching %o', path)
      devServer.watcher.add(path)
      const resolvedId = `${relativeNorm(config.root, path)}${virtualModuleSuffix}`

      debug('Resolved id %o', resolvedId)
      return resolvedId
    },
    async load(id) {
      if (!id.endsWith(virtualModuleSuffix)) return null

      debug('Loading module id %o', id)
      const filePath = id.slice(0, -virtualModuleSuffixLen)
      debug('Vue file path %o', filePath)
      const filePathRelative = relativeNorm(tsConfigDir, filePath)
      debug('Getting meta for %o', filePathRelative)
      const meta = checker.getComponentMeta(filePathRelative)
      debug('Get meta data for %o', filePathRelative)
      const metaJson = JSON.stringify(meta)

      debug('Generating client code for %o', filePathRelative)
      return `\
import { shallowReactive } from 'vue'
export const meta = shallowReactive(${metaJson});
export default meta;

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (!newModule) return;
    import.meta.hot.data.meta = Object.assign(import.meta.hot.data.meta ?? meta, newModule.meta);
  });
}
`
    },
  }
}

export const VueComponentMeta = vueComponentMeta

// eslint-disable-next-line import/no-default-export
export default vueComponentMeta
