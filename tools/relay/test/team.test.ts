import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEAM_MAP } from "../../../scripts/openspec/lib/team-parse.mjs";
import { slackHandles, TEAM_TTL_MS, TeamMap } from "../src/team.ts";

/** The team map: a Slack member id to the handle the store knows, cached ten
 * minutes because a landing and a payload both ask for it.
 *
 * The relay parses nothing itself — `team-parse.mjs` is `team.mjs`'s own
 * reading of the file — so what these tests hold is the map the relay ends up
 * with, written out by hand: a projection asserted against a second
 * projection is two readings agreeing about nothing. */

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

describe("the map", () => {
  it("reads a fixture in the store's shape as the map the relay holds", () => {
    expect(slackHandles(FIXTURE)).toEqual(
      new Map([
        // The `@` and the case are folded; a handle with no member is left
        // out altogether.
        ["U0PM", "ecchochan"],
        ["U0DESIGN", "dee"],
      ]),
    );
  });

  it("reads the store's own map, which names the members it names", () => {
    // The store's map is the file, so this says what it says today: every
    // member it carries resolves to a handle it carries, and a handle with no
    // member is in neither.
    const handles = slackHandles(STORE_MAP);
    for (const [member, handle] of handles) {
      expect(member).toMatch(/^U[A-Z0-9]+$/);
      expect(handle).toMatch(/^[a-z0-9._-]+$/);
      expect(STORE_MAP).toContain(`slack: ${member}`);
    }
    expect(handles.size).toBe(
      STORE_MAP.split("\n").filter((line) => line.trim().startsWith("slack:"))
        .length,
    );
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
