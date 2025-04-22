import type { Options } from './options'
import fg from 'fast-glob'
import { normalizePath } from 'vite'
import { debug, extensionsToGlob } from './utils'

/**
 * Resolves the files that are valid components for the given context.
 */
export const getFilesFromPath = async (path: string, options: Options): Promise<string[]> => {
  const {
    exclude,
    extensions,
  } = options

  const ext = extensionsToGlob(extensions)

  const files = await fg(`**/*.${ext}`, {
    ignore: ['node_modules', '.git', '**/__*__/*', ...exclude],
    absolute: true,
    onlyFiles: true,
    cwd: path,
  })

  debug('files %O', files)

  return files.map((file) => normalizePath(file))
}
