import { execSync } from 'node:child_process'
import colors from 'picocolors'
import cac from 'cac'
import { version } from '../package.json'
import { getConfig } from './config'
import { parserTemplateTag } from './parser'
import { createLogger } from './logger'

async function run(key?: string, configFile?: string, configRoot?: string) {
  const config = await getConfig(key, configFile, configRoot)
  if (config) {
    for (const step of config.default?.steps || []) {
      // eslint-disable-next-line prefer-const
      let { value: cmd, tags } = parserTemplateTag(step.command, step.tags || {})
      const beforeCmd = step.before?.(cmd, tags)
      if (beforeCmd)
        cmd = beforeCmd

      if (step.disabled === true || (typeof step.disabled === 'function' && step.disabled(cmd, tags)))
        continue

      createLogger().info(`${colors.cyan('Run command:')} ${colors.green(cmd)}`, { timestamp: true })
      try {
        const execRes = execSync(cmd, { stdio: 'inherit' })
        step.after?.(cmd, execRes)
      }
      catch (error) {
        if (!config.default?.isSkipError) {
          createLogger(config?.default?.logLevel).error('Run command error.', { error: error as Error, timestamp: true })
          step.error?.(error as Error)
        }
        if (config.default?.isThrowErrorBreak)
          break
      }
    }
  }
}

export function start() {
  const cli = cac('cwf')
  cli
    .version(version)
    .option('-c, --config <path>', 'Path to config file')
    .help()

  cli
    .command('[key]', 'Run command by key.').action((key: string, options) => {
      run(key, options.config)
    })

  cli.parse()
}
