export function flattenArguments(
  args: Record<string, boolean | number | string>
) {
  const flattenedArguments: string[] = []

  for (const [property, value] of Object.entries(args)) {
    flattenedArguments.push(`--${property}`, String(value))
  }

  return flattenedArguments
}
