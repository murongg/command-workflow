/* eslint no-console: 0 */
// fork vite logger.ts
import colors from 'picocolors'

export type LogType = 'error' | 'warn' | 'info'
export type LogLevel = LogType | 'silent'
export interface Logger {
  info(msg: string, options?: LogOptions): void
  warn(msg: string, options?: LogOptions): void
  warnOnce(msg: string, options?: LogOptions): void
  error(msg: string, options?: LogErrorOptions): void
  hasWarned: boolean
}

export interface LogOptions {
  clear?: boolean
  timestamp?: boolean
}

export interface LogErrorOptions extends LogOptions {
  error?: Error | null
}

export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
}

export interface LoggerOptions {
  prefix?: string
}

export function createLogger(
  level: LogLevel = 'info',
  options: LoggerOptions = {},
): Logger {
  const { prefix = '[CWF]' } = options
  const thresh = LogLevels[level]

  function output(type: LogType, msg: string, options: LogErrorOptions = {}) {
    if (thresh >= LogLevels[type]) {
      const method = type === 'info' ? 'log' : type
      const format = () => {
        if (options.timestamp) {
          const tag
            = type === 'info'
              ? colors.cyan(colors.bold(prefix))
              : type === 'warn'
                ? colors.yellow(colors.bold(prefix))
                : colors.red(colors.bold(prefix))
          return `${colors.dim(new Date().toLocaleTimeString())} ${tag} ${msg}`
        }
        else {
          return msg
        }
      }
      if (options.error)
        msg += `\n${options.error.stack}`

      console[method](format())
    }
  }

  const warnedMessages = new Set<string>()

  const logger: Logger = {
    hasWarned: false,
    info(msg, opts) {
      output('info', msg, opts)
    },
    warn(msg, opts) {
      logger.hasWarned = true
      output('warn', msg, opts)
    },
    warnOnce(msg, opts) {
      if (warnedMessages.has(msg))
        return
      logger.hasWarned = true
      output('warn', msg, opts)
      warnedMessages.add(msg)
    },
    error(msg, opts) {
      logger.hasWarned = true
      output('error', msg, opts)
    },
  }

  return logger
}
