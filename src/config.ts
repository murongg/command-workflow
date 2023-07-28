import { join, resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { importModule } from 'local-pkg'
import { getDefaultConfigPrefixes } from './constants'
import type { Step } from './types'
import type { LogLevel } from './logger'
import { createLogger } from './logger'
import { isWindows, randomUniqueKey } from './utils'

export interface UserConfig {
  /**
   * Log level.
   * @default 'info'
   */
  logLevel?: LogLevel
  /**
   * Whether to skip error.
   * @default false
   */
  isSkipError?: boolean
  /**
   * When throw error whether to break.
   * @default false
   */
  isThrowErrorBreak?: boolean
  /**
   * Steps.
   */
  steps: (Step | string)[]
}

export type UserConfigFn = (...args: any[]) => UserConfig | Promise<UserConfig>

export interface UserConfigMap {
  default: UserConfig | UserConfigFn | null
  [x: string]: UserConfig | UserConfigFn | null
}
export type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigMap | Promise<UserConfigMap> | UserConfigFn

export function defineConfig(config: UserConfig): UserConfig
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
export function defineConfig(config: UserConfigMap): UserConfigMap
export function defineConfig(config: Promise<UserConfigMap>): Promise<UserConfigMap>
export function defineConfig(config: UserConfigFn): UserConfigFn
export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config
}

type UserConfigOnlyStep = Omit<UserConfig, 'steps'> & { steps: Step[] }
interface UserConfigMapOmitFn {
  default: UserConfigOnlyStep | null
  [x: string]: UserConfigOnlyStep | null
}

const config: UserConfigMapOmitFn = {
  default: null,
}
export async function getConfig(key?: string, configFile?: string, configRoot?: string) {
  if (config.default && !key)
    return config
  const configTmp = await loadConfigFromFile(configFile, configRoot)
  let realConfig: UserConfig = {
    steps: [],
  }
  if (Reflect.has(configTmp || {}, 'steps')) {
    realConfig = typeof configTmp === 'function' ? await configTmp() : configTmp as UserConfig
  }
  else if (Reflect.has(configTmp || {}, key || 'default')) {
    const value = Reflect.get(configTmp || {}, key || 'default')
    realConfig = typeof value === 'function' ? await value() : value
  }
  else {
    realConfig = configTmp as UserConfig
  }
  config.default = {
    steps: [],
    logLevel: realConfig?.logLevel || 'info',
    isSkipError: realConfig?.isSkipError || false,
    isThrowErrorBreak: realConfig?.isThrowErrorBreak || false,
  }
  config.default.steps = realConfig?.steps.map((item) => {
    if (typeof item === 'string') {
      return {
        command: item,
        unikey: randomUniqueKey(),
      }
    }
    else if (typeof item === 'object') {
      return {
        ...item,
        unikey: item.unikey || randomUniqueKey(),
      }
    }
    return item
  })

  if (!config.default?.steps)
    createLogger(config.default?.logLevel).error('No steps found in config file.', { timestamp: true })
  return config
}

export async function loadConfigFromFile(configFile?: string, configRoot: string = process.cwd()): Promise<UserConfig | UserConfigFn | UserConfigMap | null> {
  let resolvedPath = ''
  if (configFile) {
    resolvedPath = resolve(join(configRoot, configFile))
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
    return typeof config.default === 'function' ? config.default() : config.default
  }
  catch (error) {
    createLogger('error').error('Failed to load config file.', { error: error as Error, timestamp: true })
    return null
  }
}
