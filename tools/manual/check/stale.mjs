/* RULE: a page committed before the specs it embeds. */
import { join } from "node:path";
import { readText } from "../src/store/disk.mts";
import { requirementBlocks } from "../src/store/read-specs.mts";
import { everyBlock } from "./context.mjs";

/** Staleness names what moved, and the commit that moved it. "A spec
 * changed" is not an action; "these two requirements changed, in that
 * commit" is. A link path or a scenario id is maintenance, so requirements
 * are compared by their meaning and a spec whose requirements all read the
 * same is not reported. The spec as it stood at the page's own commit comes
 * from one `cat-file --batch` pass over every page at once. A page read
 * against the moved spec and found right has nothing to edit, so its
 * frontmatter's `reviewed` day counts as the page's date when it is later
 * than the commit. */
export async function checkStale(root, pages, specs, dirs, git, add) {
  const wanted = [];
  for (const page of pages) {
    if (!page.lastCommit) continue;
    const at = Math.max(
      Date.parse(page.lastCommit.date),
      reviewedThrough(page.ast?.frontmatter.reviewed),
    );
    for (const id of embeddedSpecs(page.ast)) {
      const moved = specs.get(id)?.lastCommit;
      const dir = dirs.get(id);
      if (moved === undefined || dir === undefined) continue;
      if (Date.parse(moved.date) <= at) continue;
      wanted.push({
        page,
        id,
        moved,
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
      const what =
        before === undefined
          ? "spec moved since this page was committed"
          : changedSince(before, readText(join(root, one.file)));
      said.set(
        one.ref,
        what === null
          ? null
          : `\`${one.id}\` ${what}; last commit \`${one.moved.sha.slice(0, 7)}\` ${one.moved.subject}`,
      );
    }
    const reason = said.get(one.ref);
    if (reason === null) continue;
    add(
      "stale",
      one.page.path,
      `last committed ${one.page.lastCommit.date.slice(0, 10)}; ${reason}`,
    );
  }
}

const DAY = 24 * 60 * 60 * 1000;

/** The end of the reviewed day, so a spec commit made that day is covered. */
const reviewedThrough = (day) =>
  day === undefined ? 0 : Date.parse(`${day}T00:00:00Z`) + DAY;

const LINK_TARGET = /\]\([^)]*\)/g;
const SCENARIO_ID = /^(#{4}\s+Scenario:\s+)\S+-SC-\d+\s+-\s+/gm;
const SPACE = /\s+/g;

/** A requirement as it reads: where a link points and which permanent id a
 * scenario wears are maintenance, not meaning. */
const meaning = (raw) =>
  raw
    .replace(LINK_TARGET, "]")
    .replace(SCENARIO_ID, "$1")
    .replace(SPACE, " ")
    .trim();

/** What the requirements say now against what they said then, or null where
 * every one of them reads the same. */
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
        (name) =>
          was.has(name) && meaning(was.get(name)) !== meaning(now.get(name)),
      ),
    ),
    names(
      "removed",
      [...was.keys()].filter((name) => !now.has(name)),
    ),
  ].filter(Boolean);
  return parts.length === 0 ? null : `has since ${parts.join(", ")}`;
}

/** The frontmatter's spec, and every spec a block embeds — a requirement, or
 * a suite, which a chapter shows for each capability it holds. */
function embeddedSpecs(ast) {
  const ids = new Set();
  if (ast.frontmatter.spec !== undefined) ids.add(ast.frontmatter.spec);
  for (const block of everyBlock(ast.blocks)) {
    if (block.type === "spec" || block.type === "cases") ids.add(block.id);
  }
  return [...ids];
}
