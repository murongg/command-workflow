import { execSync } from 'node:child_process'
import colors from 'picocolors'
import cac from 'cac'
import { version } from '../package.json'
import { getConfig } from './config'
import { parserTemplateTag } from './parser'
import { createLogger } from './logger'

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

async function run(key?: string, configFile?: string, configRoot?: string) {
  const config = await getConfig(key, configFile, configRoot)
  const commands: string[] = []
  if (config) {
    for (const step of config.default?.steps || []) {
      const cmd = parserTemplateTag(step.command, step.tags || {})
      commands.push(cmd)
      createLogger().info(`${colors.cyan('Run command:')} ${colors.green(cmd)}`, { timestamp: true })
      try {
        execSync(cmd, { stdio: 'inherit' })
      }
      catch (error) {
        createLogger(config?.default?.logLevel).error('Run command error.', { error: error as Error, timestamp: true })
      }
    }
  }
}
