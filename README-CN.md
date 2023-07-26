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
