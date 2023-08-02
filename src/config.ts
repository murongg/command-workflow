import { createConfigLoader } from 'unconfig'
import { DEFAULT_CONFIG_PREFIXES } from './constants'
import type { Step } from './types'
import type { LogLevel, Logger } from './logger'
import { createLogger } from './logger'
import { randomUniqueKey } from './utils'

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
  /**
   * Log time options.
   */
  logTime?: {
    timeLocales?: Intl.LocalesArgument
    timeOptions?: Intl.DateTimeFormatOptions
  }
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

// eslint-disable-next-line import/no-mutable-exports
export let logger: Logger = createLogger()

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
    logTime: realConfig.logTime,
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

  logger = createLogger(config.default?.logLevel, { timeLocales: config.default.logTime?.timeLocales, timeOptions: config.default.logTime?.timeOptions })

  if (!config.default?.steps)
    logger.error('No steps found in config file.', { timestamp: true })
  return config
}

export async function loadConfigFromFile(configFile?: string, configRoot: string = process.cwd()): Promise<UserConfig | UserConfigFn | UserConfigMap | null> {
  const loader = await createConfigLoader<UserConfigExport>({
    cwd: configRoot,
    sources: [configFile
      ? {
          files: configFile || '',
          extensions: [],
        }
      : {
          files: DEFAULT_CONFIG_PREFIXES.map(item => `${item}.config`),
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
        }],
  })
  const result = await loader.load()
  delete (result.config as any)?.config
  return result.config
}
