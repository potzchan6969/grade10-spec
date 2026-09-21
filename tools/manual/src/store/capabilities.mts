import { join, posix } from "node:path";
import { storePath, walkFiles } from "./disk.mts";

/** The three files a capability directory of a change may carry: the journeys
 * the product manager writes first, the requirements, and the blind suite.
 * A directory holding any of them is a capability the change touches. */
const CAPABILITY_FILES = new Set([
  "user-journeys.md",
  "spec.md",
  "feature-tcs.md",
]);

/** One capability a change touches: the spec it is about, its directory
 * store-relative, and which of the three files that directory holds. */
export type ChangeCapability = {
  spec: string;
  dir: string;
  files: Set<string>;
};

/**
 * The capabilities one change directory holds, from one walk of its `specs/`
 * tree.
 *
 * One reader for every question asked of that tree — the change's deltas,
 * what it has written, and the files one artifact is written as. A second
 * reader keyed on `spec.md` alone answered differently: the journeys land
 * before the outline on the workflow's own documented order, so a capability
 * holding only its `user-journeys.md` is one the delta walk never saw, and
 * the artifact it writes read as a file with no text at all. The names each
 * directory holds are carried here, so no caller asks the disk a second time.
 */
export function capabilitiesOf(root: string, dir: string): ChangeCapability[] {
  const specsDir = join(dir, "specs");
  const prefix = `${storePath(root, specsDir)}/`;
  const found = new Map<string, ChangeCapability>();
  for (const file of walkFiles(root, specsDir, ".md")) {
    const name = posix.basename(file);
    if (!CAPABILITY_FILES.has(name)) continue;
    const held = found.get(posix.dirname(file));
    if (held) {
      held.files.add(name);
      continue;
    }
    const capability = posix.dirname(file);
    found.set(capability, {
      spec: capability.slice(prefix.length),
      dir: capability,
      files: new Set([name]),
    });
  }
  return [...found.values()].sort((a, b) => (a.dir < b.dir ? -1 : 1));
}
