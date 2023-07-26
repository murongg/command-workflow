export interface StepTags {
  [x: string]: (() => string) | string
}
export interface Step {
  command: string
  error?: () => void
  tags?: StepTags
  before?: (command: string, tags: Record<string, any>) => string | undefined
  after?: (command: string, buffer: Buffer) => void
}

