/**
 * A change's `.openspec.yaml`, edited a line at a time.
 *
 * The round writes three keys into it — `reviewed:`, `landed_by:` and
 * `thread:` — and a person wrote everything else that is in there: the schema,
 * the hands, the waivers, the comments above them. So the file is round-tripped
 * through the `yaml` package's document API rather than parsed and re-emitted:
 * `parseDocument` keeps every other line, its comments and its order, and a
 * write touches the one key it names.
 *
 * `tools/manual/src/store/read-changes.mts` is the reader of this file and
 * stays the only one — nothing here reads a key back to judge it, and a
 * malformed record is the reader's to refuse.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";

export const RECORD = ".openspec.yaml";

/** The record of one change: where it is, and its document. A change with no
 * record is nothing this can write to — the change id is wrong, or the CLI
 * never wrote it — so it says which file it looked for. */
export function openRecord(root, change) {
  const path = join("openspec", "changes", change, RECORD);
  const file = join(root, path);
  if (!existsSync(file)) {
    throw new Error(
      `no ${path} in ${root} — is \`${change}\` the change's id?`,
    );
  }
  const doc = YAML.parseDocument(readFileSync(file, "utf8"));
  if (doc.errors.length > 0) {
    throw new Error(`${path}: ${doc.errors[0].message}`);
  }
  return { path, file, doc };
}

/** What a scalar key holds today, or nothing where the record does not carry
 * it. Read so a writer can refuse to overwrite it. */
export function writtenValue(doc, key) {
  const held = doc.get(key);
  if (held === undefined || held === null) return undefined;
  const written = String(held).trim();
  return written === "" ? undefined : written;
}

/** Write a scalar key, keeping every other line. */
export function setValue(doc, key, value) {
  doc.set(key, value);
}

/** Write one entry of a mapping key — `reviewed: <artifact>: <id>` — creating
 * the mapping where the record has none. */
export function setEntry(doc, key, id, value) {
  if (doc.get(key) === undefined || doc.get(key) === null) {
    doc.set(key, doc.createNode({ [id]: value }));
    return;
  }
  doc.setIn([key, id], value);
}

/** The document back to disk, as the `yaml` package prints it. */
export function saveRecord({ file, doc }) {
  writeFileSync(file, doc.toString());
}
