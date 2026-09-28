/**
 * Split a list into the items shown up front and the ones behind "+N more".
 * If fewer than `minHidden` would be hidden, show everything ("+1 more" is not worth a click).
 */
export function splitTags<T>(items: T[], max: number, minHidden = 2): { shown: T[]; hidden: T[] } {
  if (items.length - max < minHidden) return { shown: items, hidden: [] };
  return { shown: items.slice(0, max), hidden: items.slice(max) };
}
