export function byDate(a, b) {
  if (a.addedAt < b.addedAt) return 1;
  if (a.addedAt > b.addedAt) return -1;
  return 0;
}
