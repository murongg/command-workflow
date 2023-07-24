import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { type UserConfig, defineConfig, loadConfigFromFile } from '../src/config'

describe('describe', () => {
  it('test defineConfig', () => {
    const config: UserConfig = {
      log: true,
      logLevel: 'info',
    }
    expect(defineConfig(config)).toMatchSnapshot()
  })

  it('test loadConfigFromFile', async () => {
    // test default
    const cwd = resolve(__dirname)
    const output = await loadConfigFromFile(undefined, cwd)
    expect(output).toEqual({
      log: true,
      logLevel: 'info',
    })
    // test file
    const file2 = resolve(__dirname, 'cwf.config.ts')
    const output2 = await loadConfigFromFile(file2)
    expect(output2).toEqual({
      log: true,
      logLevel: 'info',
    })
    // test error
    const file3 = resolve(__dirname, 'command.config.ts')
    const output3 = await loadConfigFromFile(file3)
    expect(output3).toThrowError()
  })
})
