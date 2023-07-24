import type { StepTags } from './types'

/**
 * e.g. git tag v#{tag} -m v#{message}
 * parse to git tag v1.0.0 -m v1.0.0
 * @param template
 * @param tags
 * @returns
 */
export function parserTemplateTag(template: string, tags: StepTags): string {
  return template.replace(/#\{(\w+)\}/g, (_, key) => {
    const value = tags[key]
    if (typeof value === 'function')
      return value()

    return value
  })
}
