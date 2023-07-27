export const config = {
  logLevel: 'info',
  steps: [{
    command: 'git tag v#{tag} -m #{message}',
    tags: {
      tag: 'tag',
      message: 'message',
    },
  }, 'ls'],
}

export default config
