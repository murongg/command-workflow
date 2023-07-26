import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { type UserConfig, defineConfig, getConfig, loadConfigFromFile } from '../src/config'

describe('describe', () => {
  it('test defineConfig', () => {
    const config: UserConfig = {
      logLevel: 'info',
      steps: [{
        command: 'git tag v#{tag} -m #{message}',
        tags: {
          tag: 'tag',
          message: 'message',
        },
      }],
    }
    expect(defineConfig(config)).toMatchSnapshot()
  })

  it('test loadConfigFromFile', async () => {
    // test default
    const cwd = resolve(__dirname)
    const output = await loadConfigFromFile(undefined, cwd)
    const res = {
      logLevel: 'info',
      steps: [{
        command: 'git tag v#{tag} -m #{message}',
        tags: {
          tag: 'tag',
          message: 'message',
        },
      }],
    }
    expect(output).toEqual(res)
    // test file
    const file2 = resolve(__dirname, 'cwf.config.js')
    const output2 = await loadConfigFromFile(file2)
    expect(output2).toEqual(res)
    // test error
    const file3 = resolve(__dirname, 'command.config.js')
    const output3 = await loadConfigFromFile(file3)
    expect(output3).toThrowError(Error)
    // test null
    const output4 = await loadConfigFromFile()
    expect(output4).toBe(null)
  })

  it('test getConfig', async () => {
    const cwd = resolve(__dirname)
    const output = await getConfig(undefined, undefined, cwd)
    const res = {
      logLevel: 'info',
      steps: [{
        command: 'git tag v#{tag} -m #{message}',
        tags: {
          tag: 'tag',
          message: 'message',
        },
      }],
    }
    expect(output.default).toEqual(res)
    const file2 = resolve(__dirname, 'cwf.config2.js')
    const output2 = await getConfig('a', file2)
    expect(output2.default).toEqual(res)
  })
})
