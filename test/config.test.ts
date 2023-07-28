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
    const output2 = await loadConfigFromFile('cwf.config.js', __dirname)
    expect(output2).toEqual(res)
    // test error
    const output3 = await loadConfigFromFile('command.config.js', __dirname)
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
      isSkipError: false,
      isThrowErrorBreak: false,
      steps: [{
        command: 'git tag v#{tag} -m #{message}',
        tags: {
          tag: 'tag',
          message: 'message',
        },
      }],
    }
    // remove unikey
    output.default?.steps.forEach((step) => {
      delete step.unikey
    })
    expect(output.default).toEqual(res)
    const output2 = await getConfig('a', 'cwf.config3.js', __dirname)
    // remove unikey
    output2.default?.steps.forEach((step) => {
      delete step.unikey
    })
    const output2Res = {
      logLevel: 'info',
      isSkipError: false,
      isThrowErrorBreak: false,
      steps: [{
        command: 'git tag v#{tag} -m #{message}',
        tags: {
          tag: 'tag',
          message: 'message',
        },
      }, {
        command: 'ls',
      }],
    }
    expect(output2.default).toEqual(output2Res)
  })
})
