import type { MetaCheckerOptions } from 'vue-component-meta'
import { normalizePath } from 'vite'

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
  const {
    tsConfigPath = './tsconfig.json',
    metaCheckerOptions = {
      forceUseTs: true,
      printer: { newLine: NewLineKind.LineFeed },
    },
  } = userOptions

  return {
    tsConfigPath: normalizePath(tsConfigPath),
    metaCheckerOptions,
  }
}
