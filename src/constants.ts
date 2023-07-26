export const DEFAULT_CONFIG_SUFFIXES = [
  '.config.js',
  '.config.mjs',
  '.config.ts',
  '.config.cjs',
  '.config.mts',
  '.config.cts',
]

export const DEFAULT_CONFIG_PREFIXES = [
  'cwf',
  'command-workflow',
  'command',
  'workflow',
]

export const getDefaultConfigPrefixes = () => {
  const files = []
  for (const prefix of DEFAULT_CONFIG_PREFIXES) {
    for (const suffix of DEFAULT_CONFIG_SUFFIXES)
      files.push(`${prefix}${suffix}`)
  }
  return files
}
