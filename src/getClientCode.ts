import type { MetaCheckerOptions } from 'vue-component-meta'

import { basename, dirname, extname, relative } from 'node:path'
import { normalizePath } from 'vite'
import { createChecker } from 'vue-component-meta'
import { debug, pathToName } from './utils'

const getMetaExport = (filePath: string, checker: ReturnType<typeof createChecker>) => {
  debug('Generating meta for %s', filePath)
  const meta = checker.getComponentMeta(filePath)
  const key = pathToName(basename(filePath, extname(filePath)))
  debug('Writing meta for %s as %o key', filePath, key)
  const metaJson = JSON.stringify(meta)
  return `\
  ${key}: ${metaJson},
`
}

export const getClientCode = (files: string[], tsconfigPath: string, options: MetaCheckerOptions) => {
  debug('Creating checker with options: %O', options)
  const checker = createChecker(tsconfigPath, options)
  const tsConfigDir = dirname(tsconfigPath)
  debug('Generating meta map')
  return `const metaMap = {
${files.map((file) => getMetaExport(`./${normalizePath(relative(tsConfigDir, file))}`, checker)).join('\n')}
};
export default metaMap;`

  debug('Meta map is generated')
}
