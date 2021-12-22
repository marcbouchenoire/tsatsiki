/**
 * Flatten an object of CLI arguments into a string.
 *
 * @param args - An object of CLI arguments.
 */
export function flattenArguments(
  args: Record<string, boolean | number | string>
) {
  const flattenedArguments: string[] = []

  for (const [property, value] of Object.entries(args)) {
    flattenedArguments.push(`--${property}`, String(value))
  }

  return flattenedArguments
}
