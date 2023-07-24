export interface StepTags {
  [x: string]: (() => string) | string
}
export interface Step {
  command: string
  error?: () => void
  tags?: StepTags
}

