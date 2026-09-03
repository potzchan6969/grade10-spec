import { createRequire } from "node:module";
import { join } from "node:path";
import type { IdleClaim } from "../api/types.ts";
import { readTextIfExists } from "./disk.mts";

/**
 * How long a claimed task group has sat without progress, read from git.
 *
 * The store says @dana owns group 5. It cannot say the claim landed nine days
 * ago and nothing has been checked off since, which is the exact failure
 * claim-at-pickup exists to prevent — a name on idle work reads as covered.
 * Every claim and every checkmark is a commit against one `tasks.md`, so that
 * file's own history answers it, and `docs/governance/task-ownership.md` is the
 * convention both sides implement.
 *
 * The inference is not ours. `openspec-viewer` derives it for its own board and
 * publishes it as `lib/store`, and this reads it from there rather than keeping
 * a second implementation to disagree with the tool engineers already run. It
 * arrives through the submodule at `tools/openspec-viewer`, pinned to a release
 * tag, not through the registry: the manual's hosted build has no npm
 * credentials, and the submodule is already how this repository consumes the
 * viewer.
 *
 * Absent by design, never fatal. A clone with no submodule initialised, a
 * viewer older than the entry, and a store that is not a git checkout all take
 * the same path — the groups render with no age against them, which is what
 * they did before this existed. A build that fails because an optional reading
 * is unavailable would be a worse answer than a page that stays quiet.
 */

/** The shape `lib/store` exports, narrowed to the two functions used here. */
type ViewerStore = {
  parseTasks: (text: string) => {
    num: string;
    owner: string | null;
    tasks: { done: boolean; id: string; text: string }[];
  }[];
  snapshots: (storePath: string, changeId: string) => unknown[];
  idleness: (
    group: unknown,
    snaps: unknown[],
    now: number,
  ) => { since: number; days: number; source: "claim" | "progress" } | null;
};

/** Resolved once. `null` once we know there is nothing to resolve, so a clone
 * without the submodule pays one failed require rather than one per change. */
let cached: ViewerStore | null | undefined;

function viewer(): ViewerStore | null {
  if (cached !== undefined) return cached;
  try {
    // require rather than import: every reader in this directory is
    // synchronous, and Node resolves an ESM module through require as long as
    // it has no top-level await. The entry is a façade of re-exports.
    const require = createRequire(import.meta.url);
    cached = require("../../../openspec-viewer/lib/store.mjs") as ViewerStore;
  } catch {
    cached = null;
  }
  return cached;
}

/**
 * Every claimed group of one change that git can date, keyed by the group
 * number its heading carries.
 *
 * Keyed by number because that is what the convention makes an address: an
 * owner is recorded against a group number, and `pnpm plan done <change> 3.1`
 * names a task under one. Titles are not addresses and two groups may share
 * one.
 *
 * Empty for an archived change, which is finished, and for a change with no
 * task list, which has nothing to claim.
 */
export function readIdleClaims(
  root: string,
  changeId: string,
  now = Date.now(),
): Map<string, IdleClaim> {
  const claims = new Map<string, IdleClaim>();
  const lib = viewer();
  if (!lib) return claims;

  const text = readTextIfExists(
    join(root, "openspec", "changes", changeId, "tasks.md"),
  );
  if (text === undefined) return claims;

  try {
    const snaps = lib.snapshots(root, changeId);
    for (const group of lib.parseTasks(text)) {
      const idle = lib.idleness(group, snaps, now);
      // Null is the honest answer three ways: unclaimed, finished, or a
      // history that cannot account for the current owner. None of them is a
      // number, so none of them gets an entry.
      if (!idle) continue;
      claims.set(group.num, {
        since: new Date(idle.since).toISOString(),
        days: idle.days,
        source: idle.source,
      });
    }
  } catch {
    // A store the viewer cannot read is a store with no ages, not a failed
    // build. The rest of the change is already in hand.
    return new Map();
  }

  return claims;
}
