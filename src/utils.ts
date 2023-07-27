export const isWindows = process.platform === 'win32'

export const randomUniqueKey = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const maxPos = chars.length
  let key = ''
  for (let i = 0; i < length; i++)
    key += chars.charAt(Math.floor(Math.random() * maxPos))

  return key
}
