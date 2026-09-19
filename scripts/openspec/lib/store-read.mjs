/**
 * One change as the manual reads it.
 *
 * The round's scripts need exactly what a surface needs — the change's record,
 * its written artifacts, the schema's order and the content id of what is
 * before each artifact — so they read it through the manual's own readers
 * rather than parsing the change again. `markUpstream` is the piece that wants
 * the pages and the history beside the changes, which is why this is a
 * function and not four imports at each call site.
 *
 * Read from the checkout, not from `main`: the landing step rebases on `main`
 * before it reads, so the checkout is what is about to be pushed.
 */
import { readRootsGitIndex } from "../../../tools/manual/src/store/git.mts";
import { readChanges } from "../../../tools/manual/src/store/read-changes.mts";
import { readManualPages } from "../../../tools/manual/src/store/read-manual.mts";
import { schemaArtifacts } from "../../../tools/manual/src/store/read-schema.mts";
import { rootsOf } from "../../../tools/manual/src/store/roots.mts";
import { markUpstream } from "../../../tools/manual/src/store/upstream.mts";

/** The change's entry with its upstream reading, and its schema's artifacts in
 * the order the schema declares them. Throws where the store holds no such
 * change. */
export async function readChangeEntry(root, change) {
  const roots = rootsOf(root);
  const git = await readRootsGitIndex(roots);
  const changes = readChanges(root, git, null);
  const entry = changes.find((one) => one.id === change);
  if (!entry) {
    throw new Error(`no change \`${change}\` in ${root}/openspec/changes`);
  }
  const artifacts = schemaArtifacts(root, entry.schema) ?? [];
  markUpstream(
    root,
    changes,
    { [entry.schema]: artifacts },
    readManualPages(roots, git),
    git,
  );
  return { entry, artifacts };
}
