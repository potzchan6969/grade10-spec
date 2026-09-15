import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Snapshot } from "../api/types.ts";
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

/** The demo store is not a checkout, so it has no head and no history; a fixed
 * date keeps the file the same bytes on every reading. */
const GENERATED_AT = "2026-01-01T00:00:00.000Z";

export function fixtureSnapshot(): Snapshot {
  const { snapshot } = composeStore(rootsOf(DEMO_STORE), NO_GIT, null);
  return { ...snapshot, generatedAt: GENERATED_AT };
}

if (import.meta.main) {
  writeFileSync(
    FIXTURE_FILE,
    `${JSON.stringify(fixtureSnapshot(), null, 2)}\n`,
  );
  console.info(`manual: wrote ${FIXTURE_FILE}`);
}
