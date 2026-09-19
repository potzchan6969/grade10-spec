import { describe, expect, it } from "vitest";
import {
  channelOf,
  handleOf,
  handleOfEmail,
  memberOf,
  ROLES,
  readTeamMap,
  TEAM_MAP,
} from "../../../scripts/openspec/lib/team.mjs";
import { ROLES as APP_ROLES, type TeamMap } from "../src/api/types.ts";
import { writeStore } from "./tmp-store";

/**
 * The team map is read by one module both halves of the repository import,
 * and the manual is one of them. What is asserted here is the seam: that the
 * reader's answer is the shape the manual's surfaces name a hand from, and
 * that the six roles the app knows are the six the reader knows.
 *
 * Over a fixture, never over `docs/prds/team.yaml` itself. The file is a live
 * record — a handle with no Slack member today has one the day Operations
 * answers Q42 — so asserting what it does not hold yet is a test that fails
 * when the store is corrected.
 */

const MAP = [
  "handles:",
  "  dana:",
  "    email: Dana@Example.com",
  "    slack: U0123ABCD",
  "    roles: [pm, design]",
  "  robin:",
  "    email: robin@example.com",
  "    roles: [dev]",
  "channels:",
  "  design: C0DESIGN",
  "",
].join("\n");

const storeWith = (text: string) => writeStore({ [TEAM_MAP]: text });

const map: TeamMap = readTeamMap(storeWith(MAP));

describe("the map a surface names a hand from", () => {
  it("names one handle per person, with the e-mail git config gives", () => {
    expect(handleOfEmail(map, "dana@example.com")).toBe("dana");
    // However the address was spelled in the file or asked for here.
    expect(handleOfEmail(map, "Dana@Example.com")).toBe("dana");
  });

  it("says which roles a handle may take, and where a role is posted", () => {
    expect(memberOf(map, "@Dana")?.roles).toEqual(["pm", "design"]);
    expect(memberOf(map, "dana")?.slack).toBe("U0123ABCD");
    expect(channelOf(map, "design")).toBe("C0DESIGN");
  });

  it("gives no Slack member for a handle the map does not carry one for", () => {
    // A handle with no member is sent no message, which is what its absence
    // says - not that the map is unreadable.
    expect(memberOf(map, "robin")?.roles).toEqual(["dev"]);
    expect(memberOf(map, "robin")?.slack).toBeUndefined();
  });

  it("knows no handle and no channel it does not name", () => {
    expect(memberOf(map, "nobody")).toBeUndefined();
    expect(handleOfEmail(map, "nobody@example.com")).toBeUndefined();
    expect(channelOf(map, "qa")).toBeUndefined();
  });
});

describe("the roles the app and the reader know", () => {
  it("are the same six, in the same order", () => {
    expect([...APP_ROLES]).toEqual(ROLES);
  });

  it("spell a handle the same way", () => {
    for (const written of ["@Dana", " dana ", "DANA"]) {
      expect(handleOf(written)).toBe("dana");
    }
  });
});
