import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  channelOf,
  handleOfEmail,
  memberOf,
  readTeamMap,
} from "../../../scripts/openspec/lib/team.mjs";
import { findStoreRoot } from "../src/store/disk.mts";

const storeRoot = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));

/**
 * The store's own team map, read the way every surface that names a person and
 * every message that addresses one reads it. The reader's edges are the
 * scripts' suite; what is asserted here is that the file people actually keep
 * answers the questions the manual asks of it.
 */

const map = readTeamMap(storeRoot);

describe("the store's team map", () => {
  it("names one handle per person, with the e-mail git config gives", () => {
    expect(handleOfEmail(map, "ecchochan@gmail.com")).toBe("ecchochan");
  });

  it("says which roles a handle may take", () => {
    expect(memberOf(map, "ecchochan")?.roles).toEqual(["pm", "tech", "dev"]);
  });

  it("gives no Slack member for a handle nobody has looked up yet", () => {
    // Whether the member id is written here or resolved from the e-mail
    // through the Slack app is the open item; until it is answered, a handle
    // with no member is sent no message.
    expect(memberOf(map, "ecchochan")?.slack).toBeUndefined();
  });

  it("knows no handle it does not name", () => {
    expect(memberOf(map, "nobody")).toBeUndefined();
    expect(handleOfEmail(map, "nobody@example.com")).toBeUndefined();
  });

  it("names no channel while the roles have none", () => {
    expect(channelOf(map, "design")).toBeUndefined();
  });
});
