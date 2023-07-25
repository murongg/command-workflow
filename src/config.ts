import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { importModule } from 'local-pkg'
import { getDefaultConfigPrefixes } from './constants'
import type { Step } from './types'
import type { LogLevel } from './logger'
import { createLogger } from './logger'

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
  logLevel?: LogLevel
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

let config: UserConfig | null = null
export async function getConfig() {
  if (config)
    return config
  config = await loadConfigFromFile()
  if (!config?.steps)
    createLogger(config?.logLevel).error('No steps found in config file.', { timestamp: true })

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

  if (!resolvedPath)
    return null

  try {
    const config = await importModule(resolvedPath)
    return config.default
  }
  catch (error) {
    createLogger(config?.logLevel).error('Failed to load config file.', { error: error as Error, timestamp: true })
    return null
  }
}
