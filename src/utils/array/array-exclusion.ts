export function arrayExclusion<T>(
  base: ReadonlyArray<T>,
  removalSet: ReadonlyArray<T>,
): T[] {
  return base.filter((item) => !removalSet.includes(item));
}
