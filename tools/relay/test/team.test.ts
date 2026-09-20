import { describe, expect, it } from "vitest";
import { parseTeam, TEAM_TTL_MS, TeamMap } from "../src/team.ts";

/** The team map: a Slack member id to the handle the store knows, cached ten
 * minutes because a landing and a payload both ask for it. */

const TEAM = `handles:
  ecchochan:
    email: ecchochan@gmail.com
    slack: U0PM
    roles: [pm, tech, dev]
  dee:
    slack: U0DESIGN
    roles: [design]
  kinisworking:
    roles: [dev]
channels: {}
`;

describe("the map", () => {
  it("reads a member id to a handle", () => {
    const handles = parseTeam(TEAM);
    expect(handles.get("U0PM")).toBe("@ecchochan");
    expect(handles.get("U0DESIGN")).toBe("@dee");
  });

  it("names no member for a handle with no slack line", () => {
    expect([...parseTeam(TEAM).values()]).not.toContain("@kinisworking");
  });

  it("answers an empty file with an empty map", () => {
    expect(parseTeam("handles: {}\n").size).toBe(0);
    expect(parseTeam("").size).toBe(0);
  });
});

describe("the cache", () => {
  it("reads the file once inside ten minutes and again after", async () => {
    let reads = 0;
    let now = 1_700_000_000_000;
    const map = new TeamMap(
      async () => {
        reads += 1;
        return TEAM;
      },
      () => now,
    );
    expect(await map.handleOf("U0PM")).toBe("@ecchochan");
    expect(await map.handleOf("U0DESIGN")).toBe("@dee");
    expect(reads).toBe(1);

    now += TEAM_TTL_MS - 1;
    await map.handleOf("U0PM");
    expect(reads).toBe(1);

    now += 1;
    await map.handleOf("U0PM");
    expect(reads).toBe(2);
  });

  it("answers null for a member the map does not name", async () => {
    const map = new TeamMap(async () => TEAM);
    expect(await map.handleOf("U0NEW")).toBe(null);
  });
});
