import { execSync } from 'child_process'
import colors from 'picocolors'
import cac from 'cac'
import { version } from '../package.json'
import { getConfig } from './config'
import { parserTemplateTag } from './parser'
import { createLogger } from './logger'

const cli = cac('cwf')
cli
  .version(version)
  .help()

cli
  .command('[key]', 'Run command by key.').action((key) => {
    run(key)
  })

cli.parse()

async function run(key?: string) {
  const config = await getConfig(key)
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
