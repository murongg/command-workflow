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
  steps: [
    'ls',
    {
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

> CWF allows you to use the `#{tag}` format in the command field to pass custom tags. You can use the tag names as keys in the tags field and pass methods or strings as values to CWF. CWF will parse these tags, apply them to the command, and execute the corresponding operations.  
Of course, CWF also provides some built-in tags for your convenience. [View](#built-in-tags)

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

> You can customize CWF sub-commands in the configuration file and implement multiple command workflows by appending custom sub-commands after the CWF command. As shown above, by defining a sub-command named **firstCommand** in the configuration file, you can execute the specified workflow by running the cwf firstCommand command. This way, you can easily configure and execute multiple command workflows according to your needs.

### Use hooks

- **before:** Before executing the command, a callback function can be used to modify the command and tag collection. This callback function takes the command and tag collection as parameters and allows for modifications to the command during execution. Once the callback function has completed, the program will execute the modified command returned by the callback function.
- **after:** After the command is executed, you can retrieve the executed command and the execution result through a callback function. The callback function takes the command and execution result as parameters, and it does not have a return value. This allows you to conveniently view the final executed command and its corresponding execution result.
- **error:** When an error occurs during command execution, you can use a callback function to handle the error. The callback function takes the error as a parameter and does not have a return value. This allows you to conveniently handle errors that occur during command execution.
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

## Config

### UserConfig

| Name              | Description                                  | Type                           | Default | Required |
| ----------------- | -------------------------------------------- | ------------------------------ | ------- | -------- |
| steps             | workflow step                                | [Step[]](#step)                |         | ✅        |
| logLevel          | log level                                    | `error` `warn` `info` `silent` | `info`  | ❌        |
| isSkipError       | Whether to skip the error log                | boolean                        | false   | ❌        |
| isThrowErrorBreak | Do not continue execution if an error occurs | boolean                        | false   | ❌        |

### Step

| Name     | Description                                                                                                                                     | Type                                                                  | Default | Required |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------- | -------- |
| command  | command to execute                                                                                                                              | string                                                                |         | ✅        |
| tags     | tags map                                                                                                                                        | `[x: string]: (() => string)`                                         | string  |          | ❌ |
| disabled | Whether to disabled command to run                                                                                                              | `boolean` `((command: string, tags: Record<string, any>) => boolean)` | false   | ❌        |
| error    | error callback, no return value                                                                                                                 | `(error: Error) => void`                                              |         | ❌        |
| before   | Callback before the command is executed, the return value is the command you expect to be executed eventually, the return value is not required | `(command: string, tags: Record<string, any>) => string`              |         | ❌        |
| after    | Callback after the command is executed, no return value                                                                                         | `(command: string, buffer: Buffer) => void`                           |         | ❌        |

## CLI Options

| Option                | Description             | Example                                   |
| --------------------- | ----------------------- | ----------------------------------------- |
| `-c, --config <path>` | Path to config file     | `cwf -c cwf.custom.config.js`             |
| `-t, --tags <tags>`   | Global tags for command | `cwf --tags 'tag1=1\|tag2=2\|tag3=3'` |
