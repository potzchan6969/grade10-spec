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
    changes: snapshot.changes.map(strippedClaims),
    generatedAt: GENERATED_AT,
  };
}

/**
 * The same change with no claim age against it — `lastLanded` stays.
 *
 * `demo-store/` sits inside this repository's checkout, so `readLandings`
 * reads a real history for it: `lastLanded` is the committer date of a real,
 * already-landed commit, fixed the moment that commit is made and read back
 * identically by every full checkout of this same repository — the CI job
 * that runs this test already fetches full history
 * (`.github/workflows/test.yml`'s `catalogs` job, `fetch-depth: 0`) for the
 * same reason the claim ages below need it. `IDLE_FROM`/`SHELVED_FROM`
 * (`api/overlays.ts`) are read live against it, so the Idle overlay on the
 * fixture demonstrating it (`demo-on-staging`) only holds for as long as its
 * backdated commit stays under `SHELVED_FROM` days old — see that change's
 * `proposal.md`.
 *
 * A claimed group's age is different: `readIdleClaims` bakes a day count in
 * at read time (`api/derive.ts`'s doc), which moves every day the fixture is
 * rebuilt, and is absent altogether in a clone whose `openspec-viewer`
 * submodule is not initialised — so the committed file could only ever match
 * the machine that wrote it. That is stripped, same as before.
 */
function strippedClaims(change: ChangeEntry): ChangeEntry {
  if (!change.taskGroups.some((group) => group.idle)) return change;
  return {
    ...change,
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
