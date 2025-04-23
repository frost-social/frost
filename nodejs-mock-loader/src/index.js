// @ts-check

/**
 * 特定の拡張子のインポートを空のファイルに置き換える Resolver を返す
 * @param {Readonly<string[]>} ignoreExts ex. `["CSS", "PNG"]`
 * @returns Resolver
 */
export const createMockResolver =
  (ignoreExts) =>
  /**
   * @param {string} specifier
   * @param {unknown} context
   * @param {(specifier: string, context: unknown) => unknown} next
   */
  async (specifier, context, next) => {
    if (
      ignoreExts.some((ignoreExt) =>
        specifier.toUpperCase().endsWith(ignoreExt),
      )
    ) {
      return next("/dev/null", context);
    }

    return next(specifier, context);
  };
