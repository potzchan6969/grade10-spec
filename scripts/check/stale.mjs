/* RULE: a page committed before the specs it embeds. */
import { join } from "node:path";
import { readText } from "../../apps/manual/src/store/disk.mts";
import { requirementBlocks } from "../../apps/manual/src/store/read-specs.mts";
import { everyBlock } from "./context.mjs";

/** Staleness names what moved. "A spec changed" is not an action; "these two
 * requirements changed" is. The spec as it stood at the page's own commit
 * comes from one `cat-file --batch` pass over every page at once. */
export async function checkStale(root, pages, specs, dirs, git, add) {
  const wanted = [];
  for (const page of pages) {
    if (!page.lastCommit) continue;
    const at = Date.parse(page.lastCommit.date);
    for (const id of embeddedSpecs(page.ast)) {
      const moved = specs.get(id)?.lastCommit?.date;
      const dir = dirs.get(id);
      if (moved === undefined || dir === undefined) continue;
      if (Date.parse(moved) <= at) continue;
      wanted.push({
        page,
        id,
        file: `${dir}/spec.md`,
        ref: `${page.lastCommit.sha}:${dir}/spec.md`,
      });
    }
  }

  // The ref carries the page's own commit, so pages that share one share the
  // answer and the spec is diffed once however many pages embed it.
  const blobs = await git.readBlobs([...new Set(wanted.map((one) => one.ref))]);
  const said = new Map();
  for (const one of wanted) {
    if (!said.has(one.ref)) {
      const before = blobs.get(one.ref);
      said.set(
        one.ref,
        before === undefined
          ? `\`${one.id}\` spec moved since this page was committed`
          : `\`${one.id}\` has since ${changedSince(before, readText(join(root, one.file)))}`,
      );
    }
    add(
      "stale",
      one.page.path,
      `last committed ${one.page.lastCommit.date.slice(0, 10)}; ${said.get(one.ref)}`,
    );
  }
}

function changedSince(before, after) {
  const was = requirementBlocks(before);
  const now = requirementBlocks(after);
  const names = (verb, found) =>
    found.length === 0
      ? ""
      : `${verb} ${found.map((name) => `\`${name}\``).join(", ")}`;
  const parts = [
    names(
      "added",
      [...now.keys()].filter((name) => !was.has(name)),
    ),
    names(
      "changed",
      [...now.keys()].filter(
        (name) => was.has(name) && was.get(name) !== now.get(name),
      ),
    ),
    names(
      "removed",
      [...was.keys()].filter((name) => !now.has(name)),
    ),
  ].filter(Boolean);
  return parts.length === 0
    ? "changed outside its requirements"
    : parts.join(", ");
}

function embeddedSpecs(ast) {
  const ids = new Set();
  if (ast.frontmatter.spec !== undefined) ids.add(ast.frontmatter.spec);
  for (const block of everyBlock(ast.blocks)) {
    if (block.type === "spec") ids.add(block.id);
  }
  return [...ids];
}
