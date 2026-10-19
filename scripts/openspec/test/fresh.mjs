/**
 * Every in-flight artifact read again against what is before it now: the
 * `reviewed:` line a hand's landing would have written, for each written,
 * unwaived artifact that carries none. A fixture whose commits stand for
 * landings calls it before committing, so an artifact is fresh unless a test
 * moves what is before it after its line was written.
 */
import { writeFileSync } from "node:fs";
import { NO_GIT } from "../../../tools/manual/src/store/git.mts";
import { readChanges } from "../../../tools/manual/src/store/read-changes.mts";
import { readManualPages } from "../../../tools/manual/src/store/read-manual.mts";
import { schemaArtifacts } from "../../../tools/manual/src/store/read-schema.mts";
import { rootsOf } from "../../../tools/manual/src/store/roots.mts";
import { markUpstream } from "../../../tools/manual/src/store/upstream.mts";
import { openRecord, setEntry } from "../lib/record.mjs";

/** The changes with their upstream reading, read with no history: the ids a
 * line is written with need none, and a repository with no commit yet has
 * none to read. */
function readFresh(root) {
  const changes = readChanges(root, NO_GIT, null);
  const schemas = {};
  for (const { schema } of changes)
    if (schema && !(schema in schemas))
      schemas[schema] = schemaArtifacts(root, schema) ?? [];
  const { pages, asts } = readManualPages(rootsOf(root), NO_GIT);
  markUpstream(root, changes, schemas, pages, asts, NO_GIT);
  return changes;
}

export async function freshen(root) {
  const changes = readFresh(root);
  for (const change of changes) {
    if (change.status !== "in-flight" || change.error || !change.upstream)
      continue;
    const lines = Object.entries(change.upstream).filter(
      ([id]) => change.reviewed?.[id] === undefined,
    );
    if (lines.length === 0) continue;
    const record = openRecord(root, change.id);
    for (const [id, read] of lines)
      setEntry(record.doc, "reviewed", id, read.id);
    writeFileSync(record.file, record.doc.toString({ lineWidth: 0 }));
  }
}

/** `node fresh.mjs <root>`: the same, from a fixture's synchronous commit. */
if (import.meta.url === `file://${process.argv[1]}`) {
  await freshen(process.argv[2]);
}

/** Path of this module, for a fixture that runs it as a script. */
export const FRESH = new URL(import.meta.url).pathname;
