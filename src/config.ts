import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { importModule } from 'local-pkg'
import { getDefaultConfigPrefixes } from './constants'
import type { Step } from './types'
import type { LogLevel } from './logger'
import { createLogger } from './logger'
import { isWindows } from './utils'

export interface UserConfig {
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

export interface UserConfigMap {
  default: UserConfig | null
  [x: string]: UserConfig | null
}
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigMap | Promise<UserConfigMap>

export function defineConfig(config: UserConfig): UserConfig
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
export function defineConfig(config: UserConfigMap): UserConfigMap
export function defineConfig(config: Promise<UserConfigMap>): Promise<UserConfigMap>
export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config
}

const config: UserConfigMap = {
  default: null,
}
export async function getConfig(key?: string, configFile?: string, configRoot?: string) {
  if (config.default && !key)
    return config
  const configTmp = await loadConfigFromFile(configFile, configRoot)
  if (Reflect.has(configTmp || {}, 'steps'))
    config.default = configTmp as UserConfig
  else if (Reflect.has(configTmp || {}, key || 'default'))
    config.default = (configTmp as UserConfigMap)[key || 'default']
  if (!config.default?.steps)
    createLogger(config.default?.logLevel).error('No steps found in config file.', { timestamp: true })
  return config
}

export async function loadConfigFromFile(configFile?: string, configRoot: string = process.cwd()): Promise<UserConfig | UserConfigMap | null> {
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

  if (isWindows)
    resolvedPath = `file:///${resolvedPath.replace(/\\/g, '/')}`

  try {
    const config = await importModule(resolvedPath)
    return config.default
  }
  catch (error) {
    createLogger('error').error('Failed to load config file.', { error: error as Error, timestamp: true })
    return null
  }
}
