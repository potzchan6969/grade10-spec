/** Positional edits on a block list. Every one returns a new array — the
 * editor never mutates a draft in place. */

export function insertAt<T>(list: T[], index: number, item: T): T[] {
  const next = [...list];
  next.splice(index, 0, item);
  return next;
}

export function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, at) => at !== index);
}

export function replaceAt<T>(list: T[], index: number, item: T): T[] {
  return list.map((current, at) => (at === index ? item : current));
}

export function moveBy<T>(list: T[], index: number, delta: number): T[] {
  const to = index + delta;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(to, 0, item);
  return next;
}
