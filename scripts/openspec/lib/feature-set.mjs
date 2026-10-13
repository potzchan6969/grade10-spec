/**
 * One reading of a `## Feature set` and of how a delta's folds into it: the
 * acceptance fold writes the durable spec from it, and `tcs:validate` reads a
 * change suite's anchors from the same groups, so neither can admit a group
 * the other drops.
 */

import { deltaSections } from "../../../tools/manual/src/store/markdown.mts";

/** A feature set's root groups in order: each column-0 bullet line, trimmed,
 * mapped to its items, an item being its lines. */
export function splitGroups(raw) {
  const groups = new Map();
  let items = null;
  for (const line of raw.split("\n")) {
    if (/^-\s+/.test(line)) {
      const group = line.trim();
      if (!groups.has(group)) groups.set(group, []);
      items = groups.get(group);
    } else if (!items || line.trim() === "") continue;
    else if (/^ {2}-\s+/.test(line) || items.length === 0) items.push([line]);
    else items.at(-1).push(line);
  }
  return groups;
}

/** The anchor a root group names: its bullet's text, less bold and anything
 * after a colon. */
export function groupName(group) {
  return /^-\s+(?:\*\*)?(.+?)(?:\*\*)?\s*$/
    .exec(group)[1]
    .replace(/:.*$/, "")
    .trim();
}

const textOf = (item) => item.map((line) => line.trim()).join(" ");

export function labelOf(item) {
  const text = item[0].trim().replace(/^-\s+/, "");
  const match = /^\*\*([^*]+?):?\*\*|^([^:`]+):(?=\s|$)/.exec(text);
  return (match?.[1] ?? match?.[2])?.trim() || null;
}

export const holding = (pool, label) =>
  label ? pool.flatMap((one, at) => (labelOf(one) === label ? [at] : [])) : [];

/** The root groups, in order, that a delta's `## Feature set` and `## REMOVED
 * Feature set` raws leave once folded into the durable one: an item replaces
 * the durable item under its label or is added, a group listed alone under
 * REMOVED goes, one listed with labelled items loses those and goes once
 * empty. Refuses what it cannot fold unambiguously. With `refold`, the delta
 * may already stand in the durable spec, as an accepted change's does, so a
 * removal the durable spec no longer holds is skipped. */
export function foldGroups(
  durableRaw,
  deltaRaw,
  removedRaw,
  capability,
  { refold = false } = {},
) {
  const baseGroups = splitGroups(durableRaw);
  const deltaGroups = splitGroups(deltaRaw);
  const removedGroups = splitGroups(removedRaw);
  const removedGroupNames = removedRaw
    .split("\n")
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.trim());
  if (new Set(removedGroupNames).size !== removedGroupNames.length)
    throw new Error(
      `${capability}: REMOVED Feature set names a root group more than once`,
    );
  const order = [...baseGroups.keys()];
  const fresh = [...deltaGroups.keys()].filter(
    (group) => !baseGroups.has(group),
  );
  for (const [group, deltaItems] of deltaGroups) {
    if (!baseGroups.has(group)) baseGroups.set(group, []);
    const items = baseGroups.get(group);
    for (const item of deltaItems) {
      const label = labelOf(item);
      const matches = holding(items, label);
      for (const [side, count] of [
        ["durable", matches.length],
        ["delta", holding(deltaItems, label).length],
      ])
        if (count > 1)
          throw new Error(
            `${capability}: Feature set group "${group}" holds label "${label}" more than once in the ${side} spec; make its labels unique before folding`,
          );
      if (matches.length === 1) items[matches[0]] = item;
      else if (!items.some((one) => textOf(one) === textOf(item)))
        items.push(item);
    }
  }
  for (const [group, removedItems] of removedGroups) {
    const name = group.replace(/^-\s+/, "");
    if (!baseGroups.has(group) && refold) continue;
    if (!baseGroups.has(group))
      throw new Error(
        `${capability}: REMOVED Feature set names a root group that does not exist: ${name}`,
      );
    if (removedItems.length === 0) {
      if (deltaGroups.has(group))
        throw new Error(
          `${capability}: Feature set root group cannot be both modified and removed: ${name}`,
        );
      baseGroups.delete(group);
      continue;
    }
    const items = baseGroups.get(group);
    const deltaItems = deltaGroups.get(group) ?? [];
    const removedLabels = new Set();
    for (const item of removedItems) {
      const label = labelOf(item);
      if (!label)
        throw new Error(
          `${capability}: REMOVED Feature set item in ${name} needs a label ending in a colon`,
        );
      if (removedLabels.has(label))
        throw new Error(
          `${capability}: REMOVED Feature set names item "${label}" more than once in ${name}`,
        );
      removedLabels.add(label);
      if (holding(deltaItems, label).length > 0)
        throw new Error(
          `${capability}: Feature set item cannot be both modified and removed: ${label}`,
        );
      const matches = holding(items, label);
      if (matches.length === 0 && refold) continue;
      if (matches.length !== 1)
        throw new Error(
          matches.length === 0
            ? `${capability}: REMOVED Feature set item does not exist: ${label}`
            : `${capability}: Feature set group "${group}" holds label "${label}" more than once in the durable spec; make its labels unique before folding`,
        );
      items.splice(matches[0], 1);
    }
    if (items.length === 0) baseGroups.delete(group);
  }
  // A group the durable spec does not hold takes the place of a group the
  // delta removes whole, paired in listing order, so a rename keeps its
  // place; one left over lands before the next durable group the delta lists
  // after it, and last when none follows.
  const vacated = removedGroupNames.filter(
    (group) => removedGroups.get(group).length === 0,
  );
  const listed = [...deltaGroups.keys()];
  for (const group of fresh) {
    const next =
      vacated.shift() ??
      listed
        .slice(listed.indexOf(group) + 1)
        .find((one) => !fresh.includes(one));
    order.splice(next ? order.indexOf(next) : order.length, 0, group);
  }
  return new Map(
    order
      .filter((group) => baseGroups.has(group))
      .map((group) => [group, baseGroups.get(group)]),
  );
}

/** The anchors of the feature set a spec holds once a delta folds into it,
 * folded or not yet: the durable spec's own with no delta, the delta's own
 * with no durable. */
export function foldedGroupNames(durableText, deltaText, capability) {
  const raw = (text, heading) =>
    deltaSections(text).find((one) => one.heading === heading)?.raw ?? "";
  return [
    ...foldGroups(
      raw(durableText, "Feature set"),
      raw(deltaText, "Feature set"),
      raw(deltaText, "REMOVED Feature set"),
      capability,
      { refold: true },
    ).keys(),
  ].map(groupName);
}
