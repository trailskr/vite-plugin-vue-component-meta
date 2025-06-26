import type { MetaCheckerOptions } from 'vue-component-meta'
import { normalizePath } from 'vite'

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
   * @default {
   *   forceUseTs: true,
   *   noDeclarations: true,
   *   schema: {
   *     ignore: [() => true],
   *   },
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
      noDeclarations: true,
      schema: {
        ignore: [() => true],
      },
      printer: { newLine: 1 }, // NewLineKind.LineFeed from typescript
    },
  } = userOptions

  return {
    tsConfigPath: normalizePath(tsConfigPath),
    metaCheckerOptions,
  }
}
