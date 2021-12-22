/**
 * Generate a 10 characters random ID.
 */
export function generateRandomId() {
  return Math.round(Date.now() * Math.random()).toString(16)
}
