export function extractIds<T extends { _id: string }>(items: T[]): string[] {
  return items.map(item => item._id);
}
