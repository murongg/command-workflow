import { execSync } from 'child_process'
import { loadConfigFromFile } from './config'
import { parserTemplateTag } from './parser'

export async function run() {
  const config = await loadConfigFromFile()
  if (!config?.steps)
    throw new Error('No steps found in config file')
  if (config && config.steps) {
    const commands: string[] = []
    for (const step of config.steps) {
      const cmd = parserTemplateTag(step.command, step.tags || {})
      commands.push(cmd)
      try {
        execSync(cmd, { stdio: 'inherit' })
      }
      catch (error) {
        console.error(error)
      }
    }
  }
}
