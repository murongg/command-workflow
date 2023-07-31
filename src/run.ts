import { execSync } from 'node:child_process'
import colors from 'picocolors'
import cac from 'cac'
import { version } from '../package.json'
import { getConfig, logger } from './config'
import { parserTemplateTag } from './parser'
import type { Step } from './types'

let globalTags: Record<string, string> = {}
async function run(key?: string, configFile?: string, configRoot?: string, specifySteps?: string[]) {
  const config = await getConfig(key, configFile, configRoot)
  if (config) {
    let steps: Step[] = config.default?.steps || []
    steps = specifySteps?.length ? filterSpecifySteps(steps, specifySteps) : steps
    for (const step of steps) {
      const tagsAll = {
        ...globalTags,
        ...step.tags,
      }
      // eslint-disable-next-line prefer-const
      let { value: cmd, tags } = parserTemplateTag(step.command, tagsAll)
      const beforeCmd = step.before?.(cmd, tags)
      if (beforeCmd)
        cmd = beforeCmd

      if (step.disabled === true || (typeof step.disabled === 'function' && step.disabled(cmd, tags)))
        continue

      logger.info(`${colors.cyan('Run command:')} ${colors.green(cmd)}`, { timestamp: true })
      try {
        const execRes = execSync(cmd, { stdio: 'inherit' })
        step.after?.(cmd, execRes)
      }
      catch (error) {
        if (!config.default?.isSkipError) {
          logger.error('Run command error.', { error: error as Error, timestamp: true })
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
    .option('-c, --config <file>', 'Path to config file.')
    .option('-r, --root <path>', 'Path to config root.')
    .option('-t, --tags <tags>', 'Global tags for command.') // cwf --tags 'tag1=1|tag2=2'
    .option('-s, --specify-steps <steps>', 'Specify steps to run, the value is the unikey you set.') // cwf -s '1,3,2'
    .help()

  cli
    .command('[key]', 'Run command by key.').action((key: string, options) => {
      globalTags = options.tags
        ? (options.tags as string).split('|').reduce((prev, curr) => {
            const [key, value] = curr.split('=')
            prev[key] = value
            return prev
          }, {} as Record<string, string>)
        : {}
      const specifySteps = (options.specifySteps || '').split(',').filter((step: any) => !!step)
      run(key, options.config, options.root, specifySteps)
    })

  cli.parse()
}

function filterSpecifySteps(steps: Step[], specifySteps: string[]) {
  // sort by specifySteps order
  const newSteps = steps.sort((a, b) => {
    const aIndex = specifySteps.indexOf(a.unikey || '')
    const bIndex = specifySteps.indexOf(b.unikey || '')
    if (aIndex === -1 && bIndex === -1)
      return 0
    if (aIndex === -1)
      return 1
    if (bIndex === -1)
      return -1
    return aIndex - bIndex
  })

  return newSteps.filter(step => specifySteps.includes(step.unikey || ''))
}
