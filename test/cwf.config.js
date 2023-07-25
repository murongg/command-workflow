export const config = {
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

export default config