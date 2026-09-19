import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { OVERLAYS, overlaysOf } from "../src/api/overlays";
import { STAGES, stageOf } from "../src/api/stages";
import { FIXTURE_FILE, fixtureSnapshot } from "../src/store/build-fixture.mts";
import { NO_GIT } from "../src/store/git.mts";
import { readArchivedChanges } from "../src/store/read-changes.mts";
import { FROZEN_NOW } from "../walk/frozen-clock";

/**
 * The bundled fallback is a reading of `demo-store/`, not a file anyone
 * maintains: a shape the readers have moved past would otherwise reach the
 * shell only as a crash, and only where the store is not being served.
 */
const committed = JSON.parse(readFileSync(FIXTURE_FILE, "utf8"));

const DEMO_STORE = fileURLToPath(new URL("../demo-store", import.meta.url));

describe("the bundled fixture snapshot", () => {
  it("is what the readers make of the demo store", () => {
    expect(committed).toEqual(fixtureSnapshot());
  });

  it("derives an index the shell can render", () => {
    const index = buildIndex(committed);
    expect(index.groups.length).toBeGreaterThan(0);
    expect(index.topicGroups.flatMap((group) => group.topics)).not.toHaveLength(
      0,
    );
  });
});

/**
 * The walk's own ground truth (task 8.3): every stage the ladder names and
 * every overlay beside it has one change to show it, so a journey that walks
 * one never finds the board empty of it. Archived lives outside the
 * snapshot's own `changes` (`/api/archive`), so its coverage is read off the
 * demo store directly, the way `readArchivedChanges` always is.
 */
describe("the fixture's coverage of every stage and overlay", () => {
  const artifacts = committed.schemas["grade10-planning"] ?? [];
  const archived = readArchivedChanges(DEMO_STORE, NO_GIT);
  const overlayContext = {
    now: FROZEN_NOW.getTime(),
    released: new Set<string>(),
    artifacts,
  };

  const stagesShown = new Set([
    ...committed.changes.map((change: unknown) => stageOf(change, artifacts)),
    ...archived.map((change) => stageOf(change, artifacts)),
  ]);

  const overlaysShown = new Set(
    committed.changes.flatMap((change: unknown) =>
      overlaysOf(change, overlayContext).map((overlay) => overlay.kind),
    ),
  );

  it("holds one change at every stage of the ladder", () => {
    for (const stage of STAGES) {
      expect(stagesShown, `no fixture change shows "${stage}"`).toContain(
        stage,
      );
    }
  });

  it("holds one change carrying every overlay", () => {
    for (const kind of OVERLAYS) {
      expect(overlaysShown, `no fixture change carries "${kind}"`).toContain(
        kind,
      );
    }
  });

  it("holds one change idle long enough to reach the shelf", () => {
    const shelved = committed.changes.some((change: unknown) =>
      overlaysOf(change, overlayContext).some(
        (overlay) => overlay.kind === "idle" && overlay.shelved,
      ),
    );
    expect(shelved, "no fixture change is idle past the shelf bound").toBe(
      true,
    );
  });

  it("carries a record nothing could read", () => {
    expect(
      committed.changes.some(
        (change: { error?: unknown }) => change.error !== undefined,
      ),
    ).toBe(true);
  });

  it("carries a team map in the demo store's own tree", () => {
    expect(() =>
      readFileSync(`${DEMO_STORE}/docs/prds/team.yaml`, "utf8"),
    ).not.toThrow();
  });
});
