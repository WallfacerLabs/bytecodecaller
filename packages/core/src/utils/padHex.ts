export function padHex(hex: string) {
  const padOffset = Math.ceil(hex.length / 2) * 2
  return hex.padStart(padOffset, '0')
}
