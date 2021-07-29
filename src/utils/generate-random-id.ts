export function generateRandomId() {
  return Math.round(Date.now() * Math.random()).toString(16)
}
