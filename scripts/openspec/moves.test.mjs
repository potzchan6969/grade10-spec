import assert from "node:assert/strict";
import { test } from "node:test";

import { messagesOf, movesBetween, newlyBehind } from "./lib/moves.mjs";

/**
 * `movesBetween`, `newlyBehind` and `messagesOf` over two plain `Map`s — no
 * git, no filesystem, no worktree. `readingOf` is what builds a `Map` like
 * this from a store; these three never call it, so a case here is exact about
 * what changed between two readings rather than about a fixture repository.
 */

/** One change's reading, as `readingOf` would return it for one entry — every
 * field a caller of `movesBetween`, `newlyBehind` or `messagesOf` reads. */
function at(id, overrides = {}) {
  return {
    id,
    title: overrides.title ?? id,
    stage: "planned",
    roles: ["dev"],
    artifacts: [{ id: "tasks", hand: "dev" }],
    hands: { dev: "erin" },
    thread: undefined,
    behind: [],
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

const options = { manualUrl: "https://spec.test/planning" };

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

test("newlyBehind names the artifact that was not behind at the base", () => {
  const base = new Map([["probe", at("probe", { behind: [] })]]);
  const head = new Map([
    [
      "probe",
      at("probe", {
        behind: [{ artifact: "decisions", changed: ["proposal"] }],
      }),
    ],
  ]);

  assert.deepEqual(newlyBehind(base, head), [
    { id: "probe", artifact: "decisions", changed: ["proposal"] },
  ]);
});

test("shared-planning-change-stages-SC-39 - newlyBehind says nothing twice when what is behind it changes again", () => {
  const base = new Map([
    [
      "probe",
      at("probe", {
        behind: [{ artifact: "decisions", changed: ["proposal"] }],
      }),
    ],
  ]);
  const head = new Map([
    [
      "probe",
      at("probe", {
        behind: [
          { artifact: "decisions", changed: ["proposal", "user-journeys"] },
        ],
      }),
    ],
  ]);

  assert.deepEqual(newlyBehind(base, head), []);
});

test("newlyBehind reads only the earliest behind artifact of each change", () => {
  const base = new Map([["probe", at("probe", { behind: [] })]]);
  const head = new Map([
    [
      "probe",
      at("probe", {
        behind: [
          { artifact: "decisions", changed: ["proposal"] },
          { artifact: "tasks", changed: ["decisions"] },
        ],
      }),
    ],
  ]);

  assert.deepEqual(newlyBehind(base, head), [
    { id: "probe", artifact: "decisions", changed: ["proposal"] },
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

test("messagesOf keys a behind message by the change and the artifact, with the change's id alongside", () => {
  const base = new Map([["probe", at("probe", { roles: [], behind: [] })]]);
  const head = new Map([
    [
      "probe",
      at("probe", {
        roles: [],
        behind: [{ artifact: "tasks", changed: ["decisions"] }],
      }),
    ],
  ]);

  const { messages } = messagesOf(base, head, TEAM, options);

  assert.equal(messages.length, 1);
  assert.equal(messages[0].id, "probe");
  assert.equal(messages[0].key, "probe:behind:tasks");
  assert.equal(messages[0].kind, "behind");
  assert.match(messages[0].text, /tasks/);
  assert.match(messages[0].text, /decisions/);
});
