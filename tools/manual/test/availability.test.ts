import { describe, expect, it } from "vitest";
import { availabilityIsStale, visibleAvailabilityState } from "../src/api/availability";
import { projectAvailability, receiptsFrom } from "../src/store/availability.mts";
import { changeEntry } from "./manual-fixture";

const fingerprint = "a".repeat(64);
const change = () => changeEntry("points-expiry", [], {
  accepted: true,
  acceptanceFingerprint: fingerprint,
  implementationComplete: true,
});

const receipt = (overrides: Record<string, unknown> = {}) => ({
  version: 1 as const,
  environment: "staging",
  resolvedRef: "b".repeat(40),
  observedAt: "2026-09-25T10:00:00.000Z",
  fetchedAt: "2026-09-25T11:00:00.000Z",
  components: [{ name: "grade10-site", status: "available", resolvedRef: "b".repeat(40) }],
  changes: [{
    change: "points-expiry",
    title: "Expire points",
    fingerprint,
    archiveCommit: "c".repeat(40),
    summary: "Points expiry is available for testing.",
    components: ["grade10-site"],
  }],
  servingSet: { newly: [{ change: "points-expiry", fingerprint }], still: [], noLonger: [] },
  ...overrides,
});

describe("deployment availability", () => {
  it("projects valid receipt evidence without making an accepted change available by default", () => {
    const entry = change();
    const environments = projectAvailability([entry], [receipt()]);

    expect(environments).toHaveLength(1);
    expect(entry.availability).toMatchObject([{ environment: "staging", state: "newly" }]);
  });

  it("keeps partial and rollback receipts explicit", () => {
    const partial = change();
    projectAvailability([partial], [receipt({ changes: [{ ...receipt().changes[0], status: "partial" }] })]);
    expect(partial.availability).toMatchObject([{ state: "partial" }]);

    const rolledBack = change();
    projectAvailability([rolledBack], [
      receipt(),
      receipt({ observedAt: "2026-09-25T12:00:00.000Z", servingSet: { newly: [], still: [], noLonger: [{ change: "points-expiry", fingerprint }] }, changes: [] }),
    ]);
    expect(rolledBack.availability).toMatchObject([{ state: "no-longer" }]);
  });

  it("treats receipt freshness as the manual fetch time", () => {
    const now = Date.parse("2026-09-26T10:59:59.000Z");
    expect(availabilityIsStale({ fetchedAt: "2026-09-25T11:00:00.000Z" }, now)).toBe(false);
    expect(availabilityIsStale({ fetchedAt: "2026-09-25T11:00:00.000Z" }, now + 1_001)).toBe(true);
    expect(visibleAvailabilityState({ environment: "staging", state: "still" }, now)).toBe("stale");
  });

  it("ignores malformed deployment payloads", () => {
    expect(receiptsFrom("not json")).toEqual([]);
    expect(receiptsFrom(JSON.stringify([{ version: 1, environment: "staging" }]))).toEqual([]);
  });
});
