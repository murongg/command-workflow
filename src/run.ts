import { execSync } from 'child_process'
import { getConfig } from './config'
import { parserTemplateTag } from './parser'
import { createLogger } from './logger'

export async function run() {
  const config = await getConfig()
  const commands: string[] = []
  if (config) {
    for (const step of config.steps) {
      const cmd = parserTemplateTag(step.command, step.tags || {})
      commands.push(cmd)
      try {
        execSync(cmd, { stdio: 'inherit' })
      }
      catch (error) {
        createLogger(config?.logLevel).error('Run command error.', { error: error as Error, timestamp: true })
      }
    }
  }
}
