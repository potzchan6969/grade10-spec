import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { handleOf } from "../../../scripts/openspec/lib/handle.mjs";
import {
  parseTeamMap,
  TEAM_MAP,
} from "../../../scripts/openspec/lib/team-parse.mjs";
import { slackHandles, TEAM_TTL_MS, TeamMap } from "../src/team.ts";

/** The team map: a Slack member id to the handle the store knows, cached ten
 * minutes because a landing and a payload both ask for it.
 *
 * The relay parses nothing itself. `team-parse.mjs` is `team.mjs`'s own
 * reading of the file, re-exported by it, so these tests hold the relay's map
 * to what the store reads — from the store's real map and from one fixture in
 * its shape. */

/** The store's own map, read from the file the store reads. */
const STORE_MAP = readFileSync(
  new URL(`../../../${TEAM_MAP}`, import.meta.url),
  "utf8",
);

/** One map in the store's shape, with the edges the real file does not carry
 * yet: two handles with a member id, one without, and a handle spelled with
 * the `@` the store folds off. */
const FIXTURE = `handles:
  ecchochan:
    email: ecchochan@gmail.com
    slack: U0PM
    roles: [pm, tech, dev]
  "@Dee":
    slack: U0DESIGN
    roles: [design]
  kinisworking:
    roles: [dev]
channels: {}
`;

/** The map the store reads, projected the way the relay needs it: a member id
 * to the handle `hands:` is keyed by. */
function asStoreReads(text: string): Map<string, string> {
  const handles = new Map<string, string>();
  for (const [handle, member] of Object.entries(parseTeamMap(text).handles)) {
    if (member.slack) handles.set(member.slack, handleOf(handle));
  }
  return handles;
}

describe("the map", () => {
  it("reads the store's own map as the store reads it", () => {
    expect(slackHandles(STORE_MAP)).toEqual(asStoreReads(STORE_MAP));
  });

  it("reads a fixture in the store's shape as the store reads it", () => {
    expect(slackHandles(FIXTURE)).toEqual(asStoreReads(FIXTURE));
  });

  it("names a member id against the handle, with no @ and no case", () => {
    const handles = slackHandles(FIXTURE);
    expect(handles.get("U0PM")).toBe("ecchochan");
    expect(handles.get("U0DESIGN")).toBe("dee");
  });

  it("names no member for a handle with no slack line", () => {
    expect([...slackHandles(FIXTURE).values()]).not.toContain("kinisworking");
  });

  it("answers an empty file with an empty map", () => {
    expect(slackHandles("handles: {}\n").size).toBe(0);
    expect(slackHandles("").size).toBe(0);
  });

  it("refuses a map the store refuses", () => {
    expect(() => slackHandles("handles:\n  dana: [\n")).toThrow(/team\.yaml/);
  });
});

describe("the cache", () => {
  it("reads the file once inside ten minutes and again after", async () => {
    let reads = 0;
    let now = 1_700_000_000_000;
    const map = new TeamMap(
      async () => {
        reads += 1;
        return FIXTURE;
      },
      () => now,
    );
    expect(await map.handleOf("U0PM")).toBe("ecchochan");
    expect(await map.handleOf("U0DESIGN")).toBe("dee");
    expect(reads).toBe(1);

    now += TEAM_TTL_MS - 1;
    await map.handleOf("U0PM");
    expect(reads).toBe(1);

    now += 1;
    await map.handleOf("U0PM");
    expect(reads).toBe(2);
  });

  it("reads the map again before it says it knows nobody", async () => {
    // Somebody who joined inside the cache window is in the file and not in
    // the cache, so a miss reads the file rather than refusing the landing.
    let text = "handles: {}\n";
    let reads = 0;
    const map = new TeamMap(
      async () => {
        reads += 1;
        return text;
      },
      () => 1_700_000_000_000,
    );
    expect(await map.handleOf("U0PM")).toBe(null);
    expect(reads).toBe(2);

    text = FIXTURE;
    expect(await map.handleOf("U0PM")).toBe("ecchochan");
  });

  it("reads the file once for a member the cache already names", async () => {
    let reads = 0;
    const map = new TeamMap(async () => {
      reads += 1;
      return FIXTURE;
    });
    expect(await map.handleOf("U0PM")).toBe("ecchochan");
    expect(await map.handleOf("U0PM")).toBe("ecchochan");
    expect(reads).toBe(1);
  });
});
