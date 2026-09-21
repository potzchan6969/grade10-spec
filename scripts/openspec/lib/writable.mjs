/**
 * What a re-read of one change may write, in one place.
 *
 * `.claude/skills/workflow-round/SKILL.md`: "`openspec/changes/<change>/` and the
 * pages the proposal links, and nothing else". `reread-guard.mjs` is what
 * holds a session to that — it fails on a path a run pushed anyway — so the
 * boundary is written once here rather than beside each thing that reads it.
 *
 * The pages come from the proposal, through `pageSections` — the same reading
 * that gives a reader what is before the draft, so what a round is given and
 * what it may write are one list read two ways. A `docs/references/` page the
 * proposal cites is one of them: the evidence behind a decision is a round's
 * to correct, and the relay's own set has held it since Q55.
 */
import { pageSections } from "./perspectives.mjs";

/**
 * Every path a re-read of `change` may write: its own directory, as a prefix
 * ending in `/`, then one entry per page file its proposal links. A page is
 * the whole file whichever of its sections the proposal marked: a ❓ line goes
 * where the reader will read it, which is not always the section the change
 * cited.
 */
export function writableBy(root, change) {
  const dir = `openspec/changes/${change}`;
  const pages = pageSections(root, dir).map((one) => one.split("#")[0]);
  return [`${dir}/`, ...new Set(pages)];
}

/** Whether one path is in that set: inside a directory prefix, or the page
 * file itself. */
export const isWritable = (writable, path) =>
  writable.some((one) =>
    one.endsWith("/") ? path.startsWith(one) : path === one,
  );
