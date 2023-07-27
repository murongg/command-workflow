<div style="text-align:center;">
  <h1>command-workflow</h1>
  <p>可配置的命令工作流程，根据命令执行特定任务。 简单、灵活且易于扩展。</p>
</div>

[![NPM version](https://img.shields.io/npm/v/command-workflow?color=a1b858\&label=)](https://www.npmjs.com/package/command-workflow)

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

> CWF 允许你在命令字段中使用 `#{tag}` 格式来传入自定义标签。你可以在 tags 字段中使用标签名称作为键，将方法或字符串作为值传递给 CWF。CWF 将解析这些标签并将其应用于命令，然后执行相应操作。
当然 CWF 内置了一些 tag 方便你使用，[查看](#内置-tag)

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

> 你可以在配置文件中自定义 CWF 子命令，并通过在 CWF 命令后追加自定义子命令来实现多个命令工作流。如上，在配置文件中定义了名为 **firstCommand** 的子命令，然后执行 `cwf firstCommand` 命令即可执行指定的工作流程。这样，你可以轻松地根据需要配置和执行多个命令工作流程。

### 使用 hooks

*   **before:** 在执行命令之前，可以通过一个回调函数对命令进行修改。该回调函数接受命令和标签集合作为参数，并允许在执行时对命令进行修改。一旦回调函数执行完毕，程序将执行回调函数返回的修改后的命令。
*   **after:** 在命令执行后，你可以通过回调函数获取执行的命令和执行结果。回调函数的参数包含命令和执行结果，没有返回值。你可以方便地查看最终执行的命令和相应的执行结果。
*   **error:** 当命令执行过程中出现错误时，可以使用回调函数来处理错误。回调函数将错误作为参数，并且没有返回值。这使你可以方便地处理命令执行期间发生的错误。

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
    },
    // eslint-disable-next-line n/handle-callback-err
    error: (err) => {
      console.log('error:', error)
    }
  }],
})
```

## 内置 tag

| Tag                             | 描述               | 例子                                            |
| ------------------------------- | ---------------- | --------------------------------------------- |
| `#{timestamp}`                  | 时间戳              | `touch #{timestamp}`                          |
| `#{current_git_branch}`         | 当前 Git 分支        | `git checkout -b #{current_git_branch}`       |
| `#{current_git_commit}`         | 当前 Git commit 哈希 | `git commit -m #{current_git_commit}`         |
| `#{current_git_commit_message}` | 当前 Git commit 描述 | `git commit -m #{current_git_commit_message}` |
| `#{current_git_tag}`            | 当前 git tag       | `git tag #{current_git_tag}`                  |
| `#{current_git_repo}`           | 当前 git 仓库        | `git clone #{current_git_repo}`               |
| `#{current_git_repo_url}`       | 当前 git 仓库 url    | `git clone #{current_git_repo_url}`           |
| `#{current_git_repo_name}`      | 当前 git 仓库名称      | `echo #{current_git_repo_name}`               |
| `#{current_git_repo_owner}`     | 当前 git 仓库所有者     | `echo #{current_git_repo_owner}`              |
| `#{git_user_name}`              | 本地 Git 用户名       | `echo #{git_user_name}`                       |
| `#{git_user_email}`             | 本地 Git 邮箱        | `echo #{git_user_email}`                      |

## Config

### UserConfig

| 名称 | 描述 | 类型 | 默认值 |是否必填|
| --- | --- | --- | --- |---|
| steps | 工作流步骤  | [Step[]](#step)  |  | ✅|
| logLevel | 日志等级  | `error` `warn` `info` `silent` | `info`  | ❌|
| isSkipError | 是否跳过错误日志  |boolean | false  | ❌|
| isThrowErrorBreak | 是否出现错误不继续执行  |boolean | false  | ❌|

### Step

| 名称 | 描述 | 类型 | 默认值 |是否必填|
| --- | --- | --- | --- |---|
| command | 需要执行的命令  | string  |  | ✅|
| tags | tag 集合  | `[x: string]: (() => string)` | string |  | ❌|
| disabled | 是否禁止此命令执行  |`boolean` `((command: string, tags: Record<string, any>) => boolean)` | false  | ❌|
| error | 错误回调，无返回值 | `(error: Error) => void` |   | ❌|
| before | 命令执行之前回调，返回值是你期望最终执行的命令，返回值不是必须  | `(command: string, tags: Record<string, any>) => string` |   | ❌|
| after | 命令执行之后回调，无返回值  | `(command: string, buffer: Buffer) => void` |   | ❌|
