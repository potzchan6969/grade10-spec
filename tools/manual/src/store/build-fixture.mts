import { readFileSync, writeFileSync } from "node:fs";
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
    changes: snapshot.changes.map(dated),
    generatedAt: GENERATED_AT,
  };
}

/**
 * The same change with no age read from history: none on its claimed groups,
 * and no landing date unless `fixture-dates.json` names one.
 *
 * `demo-store/` sits inside this repository's checkout, so the readers find a
 * history for it and date every claimed group and every landing against the
 * commits that carried the files. That reading is true and an impossible
 * fixture: a committer date moves on every cherry-pick, rebase and squash
 * merge, a claimed group's age moves every day, and both are absent in a
 * clone with no history — so the committed file could only ever match the
 * machine that wrote it. The dates the fixture needs are data instead:
 * `demo-store/fixture-dates.json` maps a change id to the `lastLanded` it
 * carries, which is what lets one change show the Idle overlay for good. The
 * walk freezes its clock, so the day count it reads is fixed too; the dev
 * preview reads the same date against today and ages, as a real change does.
 */
const FIXTURE_DATES: Record<string, string> = JSON.parse(
  readFileSync(`${DEMO_STORE}/fixture-dates.json`, "utf8"),
);

function dated(change: ChangeEntry): ChangeEntry {
  const datedChange = { ...change };
  delete datedChange.lastLanded;
  const landed = FIXTURE_DATES[change.id];
  if (landed) datedChange.lastLanded = landed;
  if (!change.taskGroups.some((group) => group.idle)) return datedChange;
  return {
    ...datedChange,
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
