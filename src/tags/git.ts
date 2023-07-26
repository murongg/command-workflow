import { execSync } from 'node:child_process'

export function getCurrentGitBranch() {
  try {
    const branch = execSync('git symbolic-ref --short HEAD').toString().trim()
    return branch
  }
  catch (error) {
    console.error('Failed to get current branch:', error)
    return null
  }
}

export function getCurrentGitCommit() {
  try {
    const commit = execSync('git rev-parse HEAD').toString().trim()
    return commit
  }
  catch (error) {
    console.error('Failed to get current commit:', error)
    return null
  }
}

export function getCurrentGitCommitMessage() {
  try {
    const commit = execSync('git log -1 --pretty=%B').toString().trim()
    return commit
  }
  catch (error) {
    console.error('Failed to get current commit message:', error)
    return null
  }
}

export function getCurrentGitRepo() {
  try {
    const repo = execSync('git config --get remote.origin.url').toString().trim()
    return repo
  }
  catch (error) {
    console.error('Failed to get current repo:', error)
    return null
  }
}

export function getCurrentGitRepoName() {
  try {
    const repo = execSync('git config --get remote.origin.url').toString().trim()
    const name = repo.split('/').pop()?.replace(/\.git$/, '')
    return name
  }
  catch (error) {
    console.error('Failed to get current repo name:', error)
    return null
  }
}

export function getCurrentGitRepoOwner() {
  try {
    const repo = execSync('git config --get remote.origin.url').toString().trim()
    const owner = repo.split('/').slice(-2, -1)[0]
    return owner
  }
  catch (error) {
    console.error('Failed to get current repo owner:', error)
    return null
  }
}

export function getCurrentGitRepoUrl() {
  try {
    const repo = execSync('git config --get remote.origin.url').toString().trim()
    const url = repo.replace(/\.git$/, '')
    return url
  }
  catch (error) {
    console.error('Failed to get current repo url:', error)
    return null
  }
}

export function getCurrentGitTag() {
  try {
    const tag = execSync('git describe --tags').toString().trim()
    return tag
  }
  catch (error) {
    console.error('Failed to get current tag:', error)
    return null
  }
}

export function getGitUserName() {
  try {
    const username = execSync('git config user.name').toString().trim()
    return username
  }
  catch (error) {
    console.error('Failed to get git username:', error)
    return null
  }
}

export function getGitUserEmail() {
  try {
    const email = execSync('git config user.email').toString().trim()
    return email
  }
  catch (error) {
    console.error('Failed to get git user email:', error)
    return null
  }
}
