// The catalog of @grade10/i18n as the copy review sees it: one value per
// layer, locale, namespace and key, in the file `messages/<layer>/<locale>/
// <namespace>.json`. Pure, so the page, the worker and the local workbench
// read and write it the same way.

const isTree = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const CATALOG_ROOT = "packages/i18n/messages";

export function catalogPath({ layer, locale, namespace }) {
  for (const [name, part] of Object.entries({ layer, locale, namespace }))
    if (typeof part !== "string" || !/^[A-Za-z][A-Za-z0-9-]*$/.test(part))
      throw new TypeError(`${name} must be a catalog name`);
  return `${CATALOG_ROOT}/${layer}/${locale}/${namespace}.json`;
}

export function flatten(tree, prefix = "") {
  const flat = {};
  for (const [key, value] of Object.entries(tree)) {
    if (isTree(value)) Object.assign(flat, flatten(value, `${prefix}${key}.`));
    else flat[`${prefix}${key}`] = value;
  }
  return flat;
}

/**
 * Sets one dotted key. A key the file lacks lands after the nearest sibling
 * that precedes it in `order` (the English file's key order), so a filled-in
 * translation sits where a reader of the English expects it.
 */
export function setPath(tree, key, value, order = {}) {
  const [head, ...rest] = key.split(".");
  const child = rest.length
    ? setPath(
        isTree(tree[head]) ? tree[head] : {},
        rest.join("."),
        value,
        isTree(order[head]) ? order[head] : {},
      )
    : value;
  if (head in tree) return { ...tree, [head]: child };

  const siblings = Object.keys(order);
  const before = siblings
    .slice(0, siblings.indexOf(head))
    .reverse()
    .find((sibling) => sibling in tree);
  const entries = Object.entries(tree);
  const at =
    before === undefined
      ? siblings.includes(head)
        ? 0
        : entries.length
      : entries.findIndex(([name]) => name === before) + 1;
  entries.splice(at, 0, [head, child]);
  return Object.fromEntries(entries);
}

export const serialize = (tree) => `${JSON.stringify(tree, null, 2)}\n`;

/** The value a copy record is bound to: absent and empty hash apart. */
export async function valueHash(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value ?? null));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/**
 * Applies approved edits to the files they touch. `read(path)` returns a
 * file's text or null. An edit whose current value no longer hashes to the
 * value it was proposed against is skipped, never written over.
 */
export async function applyEdits(edits, read) {
  const files = new Map();
  const load = async (path) => {
    if (!files.has(path)) {
      const text = await read(path);
      files.set(path, text === null ? null : JSON.parse(text));
    }
    return files.get(path);
  };
  const written = new Set();
  const applied = [];
  const skipped = [];
  for (const edit of edits) {
    const path = catalogPath(edit);
    const tree = await load(path);
    if (tree === null) {
      skipped.push({ ...edit, reason: `${path} does not exist` });
      continue;
    }
    const current = flatten(tree)[edit.key];
    if (
      isTree(edit.key.split(".").reduce((node, part) => node?.[part], tree))
    ) {
      skipped.push({ ...edit, reason: `${edit.key} is a group of keys` });
      continue;
    }
    if ((await valueHash(current)) !== edit.baseHash) {
      skipped.push({ ...edit, reason: "the catalog value moved since" });
      continue;
    }
    const order =
      edit.locale === "en"
        ? {}
        : ((await load(catalogPath({ ...edit, locale: "en" }))) ?? {});
    files.set(path, setPath(tree, edit.key, edit.value, order));
    written.add(path);
    applied.push(edit);
  }
  return {
    files: [...written].map((path) => ({
      path,
      text: serialize(files.get(path)),
    })),
    applied,
    skipped,
  };
}
