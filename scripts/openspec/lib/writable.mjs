/**
 * What a re-read of one change may write, in one place.
 *
 * `.claude/skills/round/SKILL.md`: "`openspec/changes/<change>/` and the
 * pages the proposal links, and nothing else". Two steps of the job hold the
 * agent to that — `reread-settings.mjs` denies what it may not reach,
 * `reread-guard.mjs` fails on what it pushed anyway — and a boundary written
 * twice is a boundary the two steps can disagree about, which is how a page
 * write came to be allowed by the settings and failed by the guard.
 *
 * The pages come from the proposal, through `pageSections` — the same reading
 * that gives a reader what is before the draft, so what a round is given and
 * what it may write are one list read two ways.
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
