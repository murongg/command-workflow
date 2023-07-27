export interface StepTags {
  [x: string]: (() => string) | string
}
export interface Step {
  /**
   * The command to run
   */
  command: string
  /**
   * The tags to use for the command
   */
  tags?: StepTags
  /**
   * enabled or disabled the step
   */
  disabled?: boolean | ((command: string, tags: Record<string, any>) => boolean)
  /**
   * error callback
   * @param error
   * @returns
   */
  error?: (error: Error) => void
  /**
   * before hook, before executing the command
   * @param command
   * @param tags
   * @returns
   */
  before?: (command: string, tags: Record<string, any>) => string | undefined
  /**
   * after hook, after executing the command
   * @param command
   * @param buffer
   * @returns
   */
  after?: (command: string, buffer: Buffer) => void
}

