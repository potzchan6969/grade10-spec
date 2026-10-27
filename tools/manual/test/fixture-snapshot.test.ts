import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { FIXTURE_FILE, fixtureSnapshot } from "../src/store/build-fixture.mts";

/**
 * The bundled fallback is a reading of `demo-store/`, not a file anyone
 * maintains: a shape the readers have moved past would otherwise reach the
 * shell only as a crash, and only where the store is not being served.
 */
const committed = JSON.parse(readFileSync(FIXTURE_FILE, "utf8"));

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
