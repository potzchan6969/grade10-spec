/*
 * One map turns a handle into a person and a role into somewhere to post.
 * `scripts/openspec/lib/team.mjs` is its only reader — the manual imports it
 * so a surface can name a hand, the notify script imports it so a message can
 * be addressed, and the landing imports it to resolve the pusher's e-mail — so
 * the edges are asserted once, here.
 */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  channelOf,
  handleOfEmail,
  memberOf,
  readTeamMap,
  TEAM_MAP,
} from "./lib/team.mjs";

/** A store holding the team map given, or none where `text` is null. */
function storeWith(text) {
  const root = mkdtempSync(join(tmpdir(), "team-map-"));
  if (text !== null) {
    mkdirSync(join(root, "docs", "prds"), { recursive: true });
    writeFileSync(join(root, TEAM_MAP), text);
  }
  return root;
}

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
  "  design: C0456EFGH",
  "",
].join("\n");

test("reads a handle's Slack member and the roles it may take", () => {
  const map = readTeamMap(storeWith(MAP));

  assert.deepEqual(memberOf(map, "dana"), {
    email: "dana@example.com",
    slack: "U0123ABCD",
    roles: ["pm", "design"],
  });
});

test("reads a handle however the record spelled it", () => {
  const map = readTeamMap(storeWith(MAP));

  assert.equal(memberOf(map, "@Dana")?.slack, "U0123ABCD");
});

test("gives a handle with no Slack member no member, so nothing is sent", () => {
  const map = readTeamMap(storeWith(MAP));
  const robin = memberOf(map, "robin");

  assert.ok(robin, "robin is in the map");
  assert.equal(robin.slack, undefined);
  assert.deepEqual(robin.roles, ["dev"]);
});

test("knows no handle the map does not name", () => {
  const map = readTeamMap(storeWith(MAP));

  assert.equal(memberOf(map, "nobody"), undefined);
});

test("gives one channel per role, and none for a role with none", () => {
  const map = readTeamMap(storeWith(MAP));

  assert.equal(channelOf(map, "design"), "C0456EFGH");
  assert.equal(channelOf(map, "qa"), undefined);
});

test("resolves the handle of the e-mail git config gives, in any case", () => {
  const map = readTeamMap(storeWith(MAP));

  assert.equal(handleOfEmail(map, "dana@example.com"), "dana");
  assert.equal(handleOfEmail(map, "DANA@EXAMPLE.COM"), "dana");
  assert.equal(handleOfEmail(map, "nobody@example.com"), undefined);
});

test("reads a store with no map as a map that knows nobody", () => {
  const map = readTeamMap(storeWith(null));

  assert.deepEqual(map, { handles: {}, channels: {} });
  assert.equal(memberOf(map, "dana"), undefined);
  assert.equal(channelOf(map, "design"), undefined);
});

test("refuses a map that is there and cannot be read", () => {
  // A store with no map knows nobody; a map the reader cannot open says
  // nothing about who is told, and reading it as nobody would send a change's
  // messages to no-one and land nothing.
  const root = mkdtempSync(join(tmpdir(), "team-map-"));
  mkdirSync(join(root, TEAM_MAP), { recursive: true });

  assert.throws(() => readTeamMap(root), { code: "EISDIR" });
});

test("refuses two entries that are one handle", () => {
  // The second would silently replace the first, and whichever e-mail and
  // roles survived would be whichever the file listed last.
  const twice = [
    "handles:",
    "  dana:",
    "    roles: [pm]",
    "  '@Dana':",
    "    roles: [qa]",
    "",
  ].join("\n");

  assert.throws(
    () => readTeamMap(storeWith(twice)),
    /`handles.@Dana` is `dana` again/,
  );
});

test("refuses a map that is not a mapping of handles", () => {
  assert.throws(
    () => readTeamMap(storeWith("handles: dana\n")),
    /handles/,
    "a map whose handles are a line says so",
  );
});

test("refuses a map that is not valid YAML", () => {
  assert.throws(
    () => readTeamMap(storeWith("handles:\n  dana: [\n")),
    /team\.yaml/,
  );
});

test("refuses an entry that is not one person's record", () => {
  assert.throws(
    () => readTeamMap(storeWith("handles:\n  dana: U0123ABCD\n")),
    /dana/,
  );
});

test("refuses a channel that is not one id", () => {
  assert.throws(
    () => readTeamMap(storeWith("channels:\n  design: [C1, C2]\n")),
    /design/,
  );
});
