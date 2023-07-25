import { resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { type UserConfig, defineConfig, loadConfigFromFile } from '../src/config'

describe('describe', () => {
  it('test defineConfig', () => {
    const config: UserConfig = {
      log: true,
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
      log: true,
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
})
