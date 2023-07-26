import { TAGS_MAP } from './tags'
import type { StepTags } from './types'

/**
 * e.g. git tag v#{tag} -m v#{message}
 * parse to git tag v1.0.0 -m v1.0.0
 * @param template
 * @param tags
 * @returns
 */
export function parserTemplateTag(template: string, tags: StepTags): { value: string; tags: Record<string, any> } {
  const tagsMap: Record<string, any> = {}
  const value = template.replace(/#\{(\w+)\}/g, (_, key) => {
    if (Reflect.has(TAGS_MAP, key) && !Reflect.has(tags, key)) {
      const val = Reflect.get(TAGS_MAP, key)()
      tagsMap[key] = val
      return val
    }

    const value = tags[key]

    if (typeof value === 'function') {
      const val = value()
      tagsMap[key] = val
      return val
    }
    tagsMap[key] = value
    return value
  })
  return {
    value,
    tags: tagsMap,
  }
}
