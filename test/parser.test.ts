import { describe, expect, it } from 'vitest'
import type { StepTags } from '../src/types'
import { parserTemplateTag } from '../src/parser'

describe('parser', () => {
  it('test parserTemplateTag', () => {
    const template = 'git tag v#{tag} -m v#{message}'
    let tags: StepTags = {
      tag: '1.0.0',
      message: '1.0.0',
    }
    expect(parserTemplateTag(template, tags).value).toBe('git tag v1.0.0 -m v1.0.0')
    expect(parserTemplateTag(template, tags).tags).toEqual(tags)
    tags = {
      tag: () => '1.0.0',
      message: () => '1.0.0',
    }
    expect(parserTemplateTag(template, tags).value).toBe('git tag v1.0.0 -m v1.0.0')
    expect(parserTemplateTag(template, tags).tags).toEqual({
      tag: '1.0.0',
      message: '1.0.0',
    })
    expect(parserTemplateTag(template, {}).value).toBe('git tag v#{tag} -m v#{message}')
    expect(parserTemplateTag(template, {}).tags).toEqual({
      tag: '#{tag}',
      message: '#{message}',
    })
  })
})
