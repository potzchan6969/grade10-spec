import { describe, expect, it } from "vitest";
import { handlesFor } from "../src/api/stage-view.ts";
import type { SnapshotTeam } from "../src/api/types";

/**
 * `handlesFor`: the order Assign's handle picker offers the team map in — the
 * chosen role's own first, then everyone else, each group alphabetical.
 *
 * The fixture is written out of order and holds the two handles the rule has
 * to answer for: one the map lists under two roles, and one it lists under
 * none. Each case reads the whole sequence, so the order is the rule's rather
 * than the map's own keys.
 */

const TEAM: SnapshotTeam = {
  handles: {
    sam: ["dev"],
    robin: ["pm", "qa"],
    lee: [],
    dana: ["design"],
  },
};

describe("the handles one role is offered", () => {
  it("puts the role's own first, then the rest, each group alphabetical", () => {
    expect(handlesFor(TEAM, "pm")).toEqual(["robin", "dana", "lee", "sam"]);
    expect(handlesFor(TEAM, "design")).toEqual(["dana", "lee", "robin", "sam"]);
    expect(handlesFor(TEAM, "dev")).toEqual(["sam", "dana", "lee", "robin"]);
  });

  it("offers a handle the map lists under two roles first for each of them", () => {
    expect(handlesFor(TEAM, "qa")).toEqual(["robin", "dana", "lee", "sam"]);
  });

  it("offers every handle alphabetically for a role the map lists nobody under", () => {
    expect(handlesFor(TEAM, "tech")).toEqual(["dana", "lee", "robin", "sam"]);
    expect(handlesFor(TEAM, "release")).toEqual([
      "dana",
      "lee",
      "robin",
      "sam",
    ]);
  });

  it("offers nothing where the team map names no handle at all", () => {
    expect(handlesFor({ handles: {} }, "pm")).toEqual([]);
  });
});
