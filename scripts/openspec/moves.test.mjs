import assert from "node:assert/strict";
import { test } from "node:test";

import { messagesOf, movesBetween } from "./lib/moves.mjs";

/**
 * What a push moved and who hears about it: `movesBetween` and `messagesOf`,
 * over two plain `Map`s — no git, no filesystem, no worktree. `readingOf` is
 * what builds a `Map` like this from a store; nothing here calls it, so a case
 * is exact about what changed between two readings rather than about a
 * fixture repository.
 */

/** One change's reading, as `readingOf` would return it for one entry — every
 * field a caller of `movesBetween` or `messagesOf` reads. */
function at(id, overrides = {}) {
  return {
    id,
    title: overrides.title ?? id,
    stage: "planned",
    roles: ["dev"],
    artifacts: [
      { id: "decisions", hand: "pm" },
      { id: "ui-design", hand: "design" },
      { id: "tasks", hand: "dev" },
    ],
    hands: { dev: "erin" },
    thread: undefined,
    ...overrides,
  };
}

const map = (handles = {}, channels = {}) => ({ handles, channels });

const TEAM = map(
  {
    erin: { slack: "U-ERIN", roles: ["dev"] },
  },
  { dev: "C-DEV" },
);

const options = { openspecUrl: "https://spec.test/openspec/" };

test("movesBetween tells a role that gained the turn", () => {
  const base = new Map([["probe", at("probe", { roles: [] })]]);
  const head = new Map([["probe", at("probe")]]);

  assert.deepEqual(movesBetween(base, head), [
    { id: "probe", role: "dev", stage: "planned", hand: "erin" },
  ]);
});

test("movesBetween tells nobody when the same role holds the same hand", () => {
  const base = new Map([["probe", at("probe")]]);
  const head = new Map([["probe", at("probe")]]);

  assert.deepEqual(movesBetween(base, head), []);
});

test("movesBetween tells a role again when its hand changes", () => {
  const base = new Map([["probe", at("probe")]]);
  const head = new Map([["probe", at("probe", { hands: { dev: "dana" } })]]);

  assert.deepEqual(movesBetween(base, head), [
    { id: "probe", role: "dev", stage: "planned", hand: "dana" },
  ]);
});

test("shared-planning-change-stages-SC-42 - movesBetween tells the role's channel once when its hand is taken off", () => {
  const base = new Map([["probe", at("probe")]]);
  const head = new Map([["probe", at("probe", { hands: {} })]]);

  assert.deepEqual(movesBetween(base, head), [
    { id: "probe", role: "dev", stage: "planned", hand: undefined },
  ]);
});

test("shared-planning-change-stages-SC-14 - messagesOf sends nothing for a handle the team map does not know", () => {
  const base = new Map([["probe", at("probe", { roles: [] })]]);
  const head = new Map([["probe", at("probe", { hands: { dev: "nobody" } })]]);

  const { messages, skipped } = messagesOf(base, head, TEAM, options);

  assert.deepEqual(messages, []);
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].id, "probe");
  assert.match(skipped[0].why, /nobody/);
});

test("messagesOf carries the change's own id on every message", () => {
  const base = new Map([["probe", at("probe", { roles: [] })]]);
  const head = new Map([["probe", at("probe")]]);

  const { messages } = messagesOf(base, head, TEAM, options);

  assert.equal(messages.length, 1);
  assert.equal(messages[0].id, "probe");
  assert.equal(messages[0].key, "probe:planned:dev");
});
