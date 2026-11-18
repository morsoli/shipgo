export function findMissingRequired<T>(required: readonly T[], available: ReadonlySet<T>): T[] {
  return required.filter((item) => !available.has(item))
}

