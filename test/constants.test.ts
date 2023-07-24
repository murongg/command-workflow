import { describe, expect, it } from 'vitest'
import { getDefaultConfigPrefixes } from '../src/constants'

describe('constants', () => {
  it('test getDefaultConfigPrefixes', () => {
    const files = getDefaultConfigPrefixes()
    expect(files).toMatchSnapshot()
  })
})
