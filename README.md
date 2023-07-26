<div style="text-align: center;">
  <h1>command-workflow</h1>
  <p>Configurable command workflow that executes specific tasks based on commands. Simple, flexible, and easily expandable.</p>
  <p><a href="https://github.com/murongg/command-workflow/blob/main/README.md">English</a>|<a href="https://github.com/murongg/command-workflow/blob/main/README-CN.md">中文文档</a></p>
</div>

[![NPM version](https://img.shields.io/npm/v/command-workflow?color=a1b858&label=)](https://www.npmjs.com/package/command-workflow)

## Installation

```bash
npm install command-workflow -D
```

## Usage

### Basic Usage

```bash

```bash
# create config file
touch cwf.config.js
```

```js
// cwf.config.js
import { defineConfig } from 'command-workflow'

const filename = new Date().getTime()

export default defineConfig({
  steps: [{
    command: 'ls',
  }, {
    command: 'touch #{filename}',
    tags: {
      filename: () => {
        console.log('filename:', filename)
        return filename
      }
    }
  }, {
    command: 'vim #{filename}',
    tags: {
      filename: () => {
        return filename
      }
    }
  }],
})
```

```bash
# Run command 
npx cwf
# Run log
$ cwf
11:03:10 AM [CWF] Run command: ls
cwf.config.js           node_modules            package-lock.json       package.json
filename: 1690340590431
11:03:10 AM [CWF] Run command: touch 1690340590431
11:03:10 AM [CWF] Run command: vim 1690340590431
✨  Done in 1.99s.
```

### Advanced Usage

```bash 
# create config file
touch cwf.config.js
```

```js
// cwf.config.js
import { defineConfig } from 'command-workflow'

const filename = new Date().getTime()

export default defineConfig({
  firstCommand: {
    steps: [{
      command: 'ls',
    }, {
      command: 'touch #{filename}',
      tags: {
        filename: () => {
          console.log('filename:', filename)
          return filename
        }
      }
    }, {
      command: 'vim #{filename}',
      tags: {
        filename: () => {
          return filename
        }
      }
    }],
  }
})
```

```bash
# Run command 
npx cwf firstCommand
# Run log
$ cwf
11:03:10 AM [CWF] Run command: ls
cwf.config.js           node_modules            package-lock.json       package.json
filename: 1690340590431
11:03:10 AM [CWF] Run command: touch 1690340590431
11:03:10 AM [CWF] Run command: vim 1690340590431
✨  Done in 1.99s.
```

### Use hooks

- **before:** Before executing the command, a callback function can be used to modify the command and tag collection. This callback function takes the command and tag collection as parameters and allows for modifications to the command during execution. Once the callback function has completed, the program will execute the modified command returned by the callback function.
- **after:** After the command is executed, you can retrieve the executed command and the execution result through a callback function. The callback function takes the command and execution result as parameters, and it does not have a return value. This allows you to conveniently view the final executed command and its corresponding execution result.

```js 
// cwf.config.js
export default defineConfig({
  steps: [{
    command: 'ls',
  }, {
    command: 'touch #{git_user_name}',
    before: (command, tags) => {
      console.log('before command: ', command)
      console.log('before tags: ', tags)
      return `${command}-murong`
    },
    after: (command, exec) => {
      console.log('after real command: ', command)
      console.log('after exec: ', exec)
    }
  }],
})
```

## Commonjs

**If you use `commonjs` to load your module, make sure to define your config file in this way. Avoid using the `require()` method to import `command-workflow`, as `require()` executes once by default.**

```js
// cwf.config.js
module.exports = {
  steps: [{
    command: 'ls'
  }]
  ...
}
```

## Built-in tag

| Tag                             | Description                | Example                                       |
| ------------------------------- | -------------------------- | --------------------------------------------- |
| `#{timestamp}`                  | Timestamp                  | `touch #{timestamp}`                          |
| `#{current_git_branch}`         | Current git branch         | `git checkout -b #{current_git_branch}`       |
| `#{current_git_commit}`         | Current git commit hash    | `git commit -m #{current_git_commit}`         |
| `#{current_git_commit_message}` | Current git commit message | `git commit -m #{current_git_commit_message}` |
| `#{current_git_tag}`            | Current git tag            | `git tag #{current_git_tag}`                  |
| `#{current_git_repo}`           | Current git repo           | `git clone #{current_git_repo}`               |
| `#{current_git_repo_url}`       | Current git repo url       | `git clone #{current_git_repo_url}`           |
| `#{current_git_repo_name}`      | Current git repo name      | `echo #{current_git_repo_name}`               |
| `#{current_git_repo_owner}`     | Current git repo owner     | `echo #{current_git_repo_owner}`              |
| `#{git_user_name}`              | Local git user name        | `echo #{git_user_name}`                       |
| `#{git_user_email}`             | Local git user email       | `echo #{git_user_email}`                      |

## Types 
```ts
interface StepTags {
  [x: string]: (() => string) | string
}
interface Step {
  command: string
  error?: () => void
  tags?: StepTags
  before?: (command: string, tags: Record<string, any>) => string | undefined
  after?: (command: string, buffer: Buffer) => void
}

type LogType = 'error' | 'warn' | 'info'
type LogLevel = LogType | 'silent'

interface UserConfig {
  /**
     * Log level.
     * @default 'info'
     */
  logLevel?: LogLevel
  /**
     * Steps.
     */
  steps: Step[]
}
type UserConfigFn = (...args: any[]) => UserConfig | Promise<UserConfig>
interface UserConfigMap {
  default: UserConfig | UserConfigFn | null
  [x: string]: UserConfig | UserConfigFn | null
}
declare function defineConfig(config: UserConfig): UserConfig
declare function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
declare function defineConfig(config: UserConfigMap): UserConfigMap
declare function defineConfig(config: Promise<UserConfigMap>): Promise<UserConfigMap>
declare function defineConfig(config: UserConfigFn): UserConfigFn
```
