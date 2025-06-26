import type { ModuleNode, Plugin, ResolvedConfig } from 'vite'
import type { ComponentMeta } from 'vue-component-meta'

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

const lowercaseFirstLetter = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

const filterExposed = (meta: ComponentMeta): ComponentMeta => {
  return {
    ...meta,
    exposed: meta.exposed
      // the meta also includes duplicated entries in the "exposed" array with "on"
      // prefix (e.g. onClick instead of click), so we need to filter them out here
      .filter((expose) => {
        let nameWithoutOnPrefix = expose.name

        if (nameWithoutOnPrefix.startsWith('on')) {
          nameWithoutOnPrefix = lowercaseFirstLetter(expose.name.replace('on', ''))
        }

        const hasEvent = meta.events.find((event) => event.name === nameWithoutOnPrefix)
        return !hasEvent
      })
      // remove unwanted duplicated "$slots" expose
      .filter((expose) => {
        if (expose.name === '$slots') {
          const slotNames = meta.slots.map((slot) => slot.name)
          return !slotNames.every((slotName) => expose.type.includes(slotName))
        }
        return true
      }),
  }
}

export const vueComponentMeta = (userOptions: UserOptions = {}): Plugin => {
  const options = resolveOptions(userOptions)
  debug('Resolved options %O', options)

  debug('Creating meta checker using %o with options: %O', options.tsConfigPath, options.metaCheckerOptions)
  const checker = createChecker(options.tsConfigPath, options.metaCheckerOptions)
  const tsConfigDir = normalizePath(dirname(options.tsConfigPath))
  debug('tsconfig dir %o', tsConfigDir)

  let config: ResolvedConfig

  return {
    name: 'vite-plugin-vue-component-meta',
    configResolved(conf) {
      config = conf
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
      const meta = filterExposed(checker.getComponentMeta(filePathRelative))
      const metaJson = JSON.stringify(meta)

      debug('Client code for %o', filePathRelative)
      return `\
import { shallowReactive } from 'vue'
export const meta = shallowReactive(${metaJson});
export default meta;

if (import.meta.hot) {
  ${debug.enabled ? `console.log('enabled hot reload for module "${id}"');\n` : ''}\
  import.meta.hot.accept((newModule) => {
    if (!newModule) return;
    ${debug.enabled ? `console.log('hot reload module "${id}"');\n` : ''}\
    ${debug.enabled ? `console.log('current hot data: ', !!import.meta.hot.data.meta);\n` : ''}\
    import.meta.hot.data.meta = Object.assign(import.meta.hot.data.meta ?? meta, newModule.meta);
  });
}
`
    },
    async handleHotUpdate({ file, read, server, modules, timestamp }) {
      // Invalidate modules manually
      const invalidatedModules = new Set<ModuleNode>()
      for (const mod of modules) {
        server.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true)
      }

      const filePathRelative = relativeNorm(config.root, file)
      const metaVirtualModuleId = `${filePathRelative}${virtualModuleSuffix}`
      const module = server.moduleGraph.getModuleById(metaVirtualModuleId)
      if (!module) return
      checker.updateFile(filePathRelative, await read())
      debug('Change %o', filePathRelative)
      debug('Reload %o', metaVirtualModuleId)
      server.moduleGraph.invalidateModule(module, undefined, undefined, true)

      const url = `/@id/${metaVirtualModuleId}`
      server.ws.send({
        type: 'update',
        updates: [{
          type: 'js-update',
          // eslint-disable-next-line no-restricted-globals
          timestamp: Date.now(),
          path: url,
          acceptedPath: url,
        }],
      })
    },
  }
}

export const VueComponentMeta = vueComponentMeta

// eslint-disable-next-line import/no-default-export
export default vueComponentMeta
