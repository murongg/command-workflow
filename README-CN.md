<div style="text-align: center;">
  <h1>command-workflow</h1>
  <p>可配置的命令工作流程，根据命令执行特定任务。 简单、灵活且易于扩展。</p>
</div>

[![NPM version](https://img.shields.io/npm/v/command-workflow?color=a1b858&label=)](https://www.npmjs.com/package/command-workflow)

## 安装

```bash
npm install command-workflow -D
```

## 使用

### 基本使用

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

### 进阶使用

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


### 使用 hooks

- **before:** 在执行命令之前，可以通过一个回调函数对命令进行修改。该回调函数接受命令和标签集合作为参数，并允许在执行时对命令进行修改。一旦回调函数执行完毕，程序将执行回调函数返回的修改后的命令。
- **after:** 在命令执行后，你可以通过回调函数获取执行的命令和执行结果。回调函数的参数包含命令和执行结果，没有返回值。你可以方便地查看最终执行的命令和相应的执行结果。

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

**如果你使用 `commonjs` 方式加载模块，你必须使用这种方式定义你的配置文件。不要使用 `require()` 方法导入 `command-workflow` ，因为 `require()` 默认会执行一次。**

```js
// cwf.config.js
module.exports = {
  steps: [{
    command: 'ls'
  }]
  ...
}
```

## 内置 tag

| Tag                             | 描述                 | 例子                                          |
| ------------------------------- | -------------------- | --------------------------------------------- |
| `#{timestamp}`                  | 时间戳               | `touch #{timestamp}`                          |
| `#{current_git_branch}`         | 当前 Git 分支        | `git checkout -b #{current_git_branch}`       |
| `#{current_git_commit}`         | 当前 Git commit 哈希 | `git commit -m #{current_git_commit}`         |
| `#{current_git_commit_message}` | 当前 Git commit 描述 | `git commit -m #{current_git_commit_message}` |
| `#{current_git_tag}`            | 当前 git tag         | `git tag #{current_git_tag}`                  |
| `#{current_git_repo}`           | 当前 git 仓库        | `git clone #{current_git_repo}`               |
| `#{current_git_repo_url}`       | 当前 git 仓库 url    | `git clone #{current_git_repo_url}`           |
| `#{current_git_repo_name}`      | 当前 git 仓库名称    | `echo #{current_git_repo_name}`               |
| `#{current_git_repo_owner}`     | 当前 git 仓库所有者  | `echo #{current_git_repo_owner}`              |
| `#{git_user_name}`              | 本地 Git 用户名      | `echo #{git_user_name}`                       |
| `#{git_user_email}`             | 本地 Git 邮箱        | `echo #{git_user_email}`                      |

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
