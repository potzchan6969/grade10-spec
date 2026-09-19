/**
 * The store as the manual reads it, at a root a script hands over.
 *
 * The round's scripts and the messages need exactly what a surface needs —
 * each change's record, its written artifacts, its stage, the schema's order,
 * the content id of what is before each artifact, and a page's own open
 * questions beside its decisions rows — so they read it through the manual's
 * own readers rather than parsing a change again. `markUpstream` and
 * `markQuestions` are the pieces that want the pages beside the changes,
 * which is why each is a function and not five imports at each call site.
 *
 * The root is a parameter, because two of the callers read a tree that is not
 * the checkout: the landing rebases on `main` before it reads, and the push
 * workflow reads the push's base out of a detached worktree. `main` is passed
 * as `null` for the same reason — a tree read at a revision has no unmerged
 * or diverged fact to read, and asking for one would compare a worktree
 * against the origin it was cut from.
 */
import { readRootsGitIndex } from "../../../tools/manual/src/store/git.mts";
import { markQuestions } from "../../../tools/manual/src/store/questions.mts";
import {
  readArchivedChanges,
  readChanges,
} from "../../../tools/manual/src/store/read-changes.mts";
import { readManualPages } from "../../../tools/manual/src/store/read-manual.mts";
import { schemaArtifacts } from "../../../tools/manual/src/store/read-schema.mts";
import { rootsOf } from "../../../tools/manual/src/store/roots.mts";
import { markUpstream } from "../../../tools/manual/src/store/upstream.mts";

/**
 * Every in-flight change at one root, each carrying its stage and the reading
 * `behindOf` compares, with the artifacts of every schema they name.
 *
 * One walk of the history and one read of the pages for the whole tree: a
 * caller that asked per change would spawn a git process per change, and the
 * upstream reading needs the pages anyway.
 */
export async function readChangesAt(root) {
  const roots = rootsOf(root);
  const git = await readRootsGitIndex(roots);
  const changes = readChanges(root, git, null);
  const schemas = {};
  for (const { schema } of changes) {
    if (schema === "" || schema in schemas) continue;
    const artifacts = schemaArtifacts(root, schema);
    if (artifacts) schemas[schema] = artifacts;
  }
  const { pages, asts } = readManualPages(roots, git);
  markUpstream(root, changes, schemas, pages, asts, git);
  markQuestions(changes, pages, asts);
  return {
    changes,
    schemas,
    /** The archive, for the one thing the changes in flight cannot answer:
     * whether the change another one depends on has shipped. */
    archived: readArchivedChanges(root, git),
    /** The schema's artifacts for one change, in the order it declares them;
     * empty for a change on a schema this store does not define. */
    artifactsOf: (change) => schemas[change.schema] ?? [],
  };
}

/** The change's entry with its upstream reading, and its schema's artifacts in
 * the order the schema declares them. Throws where the store holds no such
 * change. */
export async function readChangeEntry(root, change) {
  const { changes, artifactsOf } = await readChangesAt(root);
  const entry = changes.find((one) => one.id === change);
  if (!entry) {
    throw new Error(`no change \`${change}\` in ${root}/openspec/changes`);
  }
  return { entry, artifacts: artifactsOf(entry) };
}
