import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { ChangeDocument, ChangeEntry, Snapshot } from "../api/types.ts";
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

/**
 * The changes' own documents, keyed by id — what `?fixture` reads in place of
 * `/api/change/<id>`, which no walk and no fixture-only shell has anything to
 * answer with. The snapshot is the board's row; this is the reading behind
 * each change page, and the only thing that dates a stage landing.
 */
export const FIXTURE_CHANGES_FILE = fileURLToPath(
  new URL("../../public/fixture-changes.json", import.meta.url),
);

const DEMO_STORE = fileURLToPath(new URL("../../demo-store", import.meta.url));

/** Pinned: a fixed date keeps the file the same bytes on every reading. */
const GENERATED_AT = "2026-01-01T00:00:00.000Z";

/** Pinned the same way, and never read as a sha by anything: a fixture's
 * landing is a date the store was given, not a commit anybody can look up. */
const FIXTURE_COMMIT = {
  sha: "0000000000000000000000000000000000000000",
  subject: "fixture-dates.json",
};

export function fixtureSnapshot(): Snapshot {
  const { snapshot } = composeStore(rootsOf(DEMO_STORE), NO_GIT, null);
  return {
    ...snapshot,
    changes: snapshot.changes.map(dated),
    generatedAt: GENERATED_AT,
  };
}

/** The same reading's documents, each artifact carrying the day
 * `fixture-dates.json` says it landed on. */
export function fixtureChanges(): Record<string, ChangeDocument> {
  const { documents } = composeStore(rootsOf(DEMO_STORE), NO_GIT, null);
  return Object.fromEntries(
    documents.map((document) => [document.id, landed(document)]),
  );
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
 * carries and to the day each of its artifacts landed on, which is what lets
 * one change show the Idle overlay for good and another show its handoff.
 * The walk freezes its clock, so the day counts it reads are fixed too; the
 * dev preview reads the same dates against today and ages, as a real change
 * does.
 */
const FIXTURE_DATES: Record<
  string,
  { landed?: string; artifacts?: Record<string, string> }
> = JSON.parse(readFileSync(`${DEMO_STORE}/fixture-dates.json`, "utf8"));

function dated(change: ChangeEntry): ChangeEntry {
  const datedChange = { ...change };
  delete datedChange.lastLanded;
  const landedOn = FIXTURE_DATES[change.id]?.landed;
  if (landedOn) datedChange.lastLanded = landedOn;
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

/**
 * The same document with each written artifact dated by the file rather than
 * by a commit — the one thing a handoff is read from, and the one thing
 * `NO_GIT` leaves absent. An artifact the file does not name keeps whatever
 * the readers gave it, which under `NO_GIT` is nothing: a stage no landing
 * dates says so on the page rather than reading as none.
 */
function landed(document: ChangeDocument): ChangeDocument {
  const dates = FIXTURE_DATES[document.id]?.artifacts;
  if (!dates) return document;
  return {
    ...document,
    artifacts: document.artifacts.map((artifact) => {
      const date = artifact.present ? dates[artifact.name] : undefined;
      return date === undefined
        ? artifact
        : { ...artifact, lastCommit: { ...FIXTURE_COMMIT, date } };
    }),
  };
}

if (import.meta.main) {
  writeFileSync(
    FIXTURE_FILE,
    `${JSON.stringify(fixtureSnapshot(), null, 2)}\n`,
  );
  writeFileSync(
    FIXTURE_CHANGES_FILE,
    `${JSON.stringify(fixtureChanges(), null, 2)}\n`,
  );
  console.info(`manual: wrote ${FIXTURE_FILE}`);
  console.info(`manual: wrote ${FIXTURE_CHANGES_FILE}`);
}
