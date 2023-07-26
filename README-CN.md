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
