import { getTimestamp } from './date'
import { getCurrentGitBranch, getCurrentGitCommit, getCurrentGitCommitMessage, getCurrentGitRepo, getCurrentGitRepoName, getCurrentGitRepoOwner, getCurrentGitRepoUrl, getCurrentGitTag, getGitUserEmail, getGitUserName } from './git'

export const TAGS_MAP = {
  timestamp: getTimestamp,
  current_git_branch: getCurrentGitBranch,
  current_git_commit: getCurrentGitCommit,
  current_git_commit_message: getCurrentGitCommitMessage,
  current_git_tag: getCurrentGitTag,
  current_git_repo: getCurrentGitRepo,
  current_git_repo_url: getCurrentGitRepoUrl,
  current_git_repo_name: getCurrentGitRepoName,
  current_git_repo_owner: getCurrentGitRepoOwner,
  git_user_name: getGitUserName,
  git_user_email: getGitUserEmail,
}
