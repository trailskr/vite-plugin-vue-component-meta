import type { MetaCheckerOptions } from 'vue-component-meta'

// from typescript
enum NewLineKind {
  CarriageReturnLineFeed = 0,
  LineFeed = 1,
}

/**
 * Plugin options.
 */
export type UserOptions = {
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

export type Options = Required<UserOptions>

export const resolveOptions = (userOptions: UserOptions): Options => {
  return Object.assign({
    componentsDirs: 'src/components',
    extensions: ['vue'],
    exclude: [],
    importMode: 'sync',
    tsConfigPath: './tsconfig.json',
    metaCheckerOptions: {
      forceUseTs: true,
      printer: { newLine: NewLineKind.LineFeed },
    },
  }, userOptions)
}
