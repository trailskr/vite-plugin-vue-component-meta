import { resolve } from 'node:path'
import Debug from 'debug'
import fg from 'fast-glob'
import { normalizePath } from 'vite'

export const extensionsToGlob = (extensions: string[]) => {
  return extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0] || ''
}

export const debug = Debug('vite-plugin-vue-component-meta')

const pascalCase = (input: string): string => {
  return input
    .trim()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

export const pathToName = (fileBaseName: string) => {
  return pascalCase(fileBaseName.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$'))
}

export const resolveDirs = (dirs: string | string[] | null, root: string) => {
  if (dirs === null) return []
  const dirsArray = Array.isArray(dirs) ? dirs : [dirs]
  const dirsResolved: string[] = []

  for (const dir of dirsArray) {
    if (dir.includes('**')) {
      const matches = fg.sync(dir, { onlyDirectories: true })
      for (const match of matches) {
        dirsResolved.push(normalizePath(resolve(root, match)))
      }
    } else {
      dirsResolved.push(normalizePath(resolve(root, dir)))
    }
  }

  return dirsResolved
}
