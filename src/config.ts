import { resolve } from 'path'
import { existsSync } from 'fs'
import { getDefaultConfigPrefixes } from './constants'
import type { Step } from './types'

export interface UserConfig {
  /**
   * Is output log.
   * @default true
   */
  log?: boolean
  /**
   * Log level.
   * @default 'info'
   */
  logLevel?: 'debug' | 'info' | 'warn' | 'error'

  /**
   * Steps.
   */
  steps: Step[]
}

export function defineConfig(config: UserConfig): UserConfig
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
export function defineConfig(config: UserConfig | Promise<UserConfig>): Promise<UserConfig> | UserConfig {
  return config
}

export async function loadConfigFromFile(configFile?: string, configRoot: string = process.cwd()): Promise<UserConfig | null> {
  let resolvedPath = ''
  if (configFile) {
    resolvedPath = resolve(configFile)
  }
  else {
    const configFiles = getDefaultConfigPrefixes()

    for (const filename of configFiles) {
      const filePath = resolve(configRoot, filename)
      if (!existsSync(filePath))
        continue

      resolvedPath = filePath
      break
    }
  }

  try {
    const config = await import(resolvedPath)
    return config.default
  }
  catch (error) {
    console.error(error)
    return null
  }
}
