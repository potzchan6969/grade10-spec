import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { ChangeEntry, Snapshot } from "../api/types.ts";
import { NO_GIT } from "./git.mts";
import { rootsOf } from "./roots.mts";
import { composeStore } from "./snapshot.mts";

/**
 * The snapshot the shell falls back to where nothing serves `/api/snapshot` —
 * a reading of `demo-store/`, by the same readers the store gets, so it can
 * never drift from the shapes the app derives. `pnpm fixture` rewrites it and
 * `test/fixture-snapshot.test.ts` holds the committed file to this reading.
 */
export const FIXTURE_FILE = fileURLToPath(
  new URL("../../public/fixture-snapshot.json", import.meta.url),
);

const DEMO_STORE = fileURLToPath(new URL("../../demo-store", import.meta.url));

/** Pinned: a fixed date keeps the file the same bytes on every reading. */
const GENERATED_AT = "2026-01-01T00:00:00.000Z";

export function fixtureSnapshot(): Snapshot {
  const { snapshot } = composeStore(rootsOf(DEMO_STORE), NO_GIT, null);
  return {
    ...snapshot,
    changes: snapshot.changes.map(undated),
    generatedAt: GENERATED_AT,
  };
}

/**
 * The same change with no age against it: none on its claimed groups, and no
 * landing to count one from.
 *
 * `demo-store/` sits inside this repository's checkout, so the readers find a
 * history for it and date every claimed group and every landing against today.
 * That age is a true reading and an impossible fixture: it moves every day,
 * and it is absent altogether in a clone whose `openspec-viewer` submodule is
 * not initialised, so the committed file could only ever match the machine
 * that wrote it. A fallback payload's ages would be stale on arrival in any
 * case — the shell falls back to this file precisely where nothing is serving
 * the store — so it carries none, for the reason `generatedAt` is pinned above
 * it.
 */
function undated(change: ChangeEntry): ChangeEntry {
  const undatedChange = { ...change };
  delete undatedChange.lastLanded;
  if (!change.taskGroups.some((group) => group.idle)) return undatedChange;
  return {
    ...undatedChange,
    taskGroups: change.taskGroups.map((group) => {
      const undatedGroup = { ...group };
      delete undatedGroup.idle;
      return undatedGroup;
    }),
  };
}

if (import.meta.main) {
  writeFileSync(
    FIXTURE_FILE,
    `${JSON.stringify(fixtureSnapshot(), null, 2)}\n`,
  );
  console.info(`manual: wrote ${FIXTURE_FILE}`);
}
