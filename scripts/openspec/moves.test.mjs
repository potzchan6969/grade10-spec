import assert from "node:assert/strict";
import { test } from "node:test";

import {
  landedBetween,
  landedText,
  messagesOf,
  movesBetween,
  newlyBehind,
} from "./lib/moves.mjs";

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
    landedBy: {},
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

test("landedBetween names the `landed_by:` entries a push added", () => {
  const base = new Map([
    ["probe", at("probe", { landedBy: { proposal: "dana" } })],
  ]);
  const head = new Map([
    [
      "probe",
      at("probe", { landedBy: { proposal: "dana", decisions: "dana" } }),
    ],
  ]);

  assert.deepEqual(landedBetween(base, head), [
    { id: "probe", landed: [{ artifact: "decisions", by: "dana" }] },
  ]);
});

test("landedBetween reads an entry that changed hands as a landing", () => {
  const base = new Map([
    ["probe", at("probe", { landedBy: { tasks: "dana" } })],
  ]);
  const head = new Map([
    ["probe", at("probe", { landedBy: { tasks: "erin" } })],
  ]);

  assert.deepEqual(landedBetween(base, head), [
    { id: "probe", landed: [{ artifact: "tasks", by: "erin" }] },
  ]);
});

test("landedBetween says nothing where no entry moved", () => {
  const base = new Map([
    ["probe", at("probe", { landedBy: { tasks: "dana" } })],
  ]);
  const head = new Map([
    ["probe", at("probe", { landedBy: { tasks: "dana" } })],
  ]);

  assert.deepEqual(landedBetween(base, head), []);
});

test("shared-planning-change-stages-SC-70 - landedText names what landed, whose word it was, the stage and whose turn it is", () => {
  const line = landedText(
    at("probe", {
      stage: "proposed",
      roles: ["design", "tech"],
      hands: { design: "dana", tech: "erin" },
    }),
    [
      { artifact: "proposal", by: "dana" },
      { artifact: "decisions", by: "dana" },
      { artifact: "user-journeys", by: "dana" },
    ],
  );

  assert.equal(
    line,
    "*Landed* — `proposal`, `decisions`, `user-journeys` by @dana · now at *Proposed* · your turn: @dana (designer), @erin (tech PIC)",
  );
});

test("landedText names the hands the stage has and never a role's channel", () => {
  const line = landedText(
    at("probe", {
      stage: "on-staging",
      roles: ["qa", "release"],
      hands: { qa: "hana" },
    }),
    [{ artifact: "tasks", by: "erin" }],
  );

  assert.equal(
    line,
    "*Landed* — `tasks` by @erin · now at *On staging* · your turn: @hana (QA)",
  );
});

test("landedText says nobody where the stage names no hand", () => {
  const line = landedText(
    at("probe", { stage: "designed", roles: [], hands: {} }),
    [{ artifact: "ui-design", by: "dana" }],
  );

  assert.equal(
    line,
    "*Landed* — `ui-design` by @dana · now at *Designed* · your turn: nobody",
  );
});

test("landedText names each word where one push carries two", () => {
  const line = landedText(at("probe", { stage: "designed", roles: [] }), [
    { artifact: "ui-design", by: "dana" },
    { artifact: "tech-design", by: "erin" },
  ]);

  assert.match(line, /`ui-design` by @dana, `tech-design` by @erin/);
});

test("shared-planning-change-stages-SC-70 - messagesOf replies in the change's thread for a landing a person pushed", () => {
  const thread = "C0AB/1700000000.000100";
  const base = new Map([["probe", at("probe", { thread })]]);
  const head = new Map([
    ["probe", at("probe", { thread, landedBy: { tasks: "dana" } })],
  ]);

  const { messages } = messagesOf(base, head, TEAM, {
    ...options,
    pushHead: "abc1234",
    pushedBy: new Map([["probe", "dana"]]),
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].key, "probe:landed:abc1234");
  assert.equal(messages[0].id, "probe");
  assert.equal(messages[0].kind, "landed");
  assert.equal(messages[0].to, "channel");
  assert.equal(messages[0].channel, "C0AB");
  assert.equal(messages[0].threadTs, "1700000000.000100");
  assert.match(messages[0].text, /\*Landed\* — `tasks` by @dana/);
});

test("shared-planning-change-stages-SC-70 - messagesOf says nothing for a landing whose pusher the team map does not name", () => {
  const thread = "C0AB/1700000000.000100";
  const base = new Map([["probe", at("probe", { thread })]]);
  const head = new Map([
    ["probe", at("probe", { thread, landedBy: { tasks: "dana" } })],
  ]);

  const { messages } = messagesOf(base, head, TEAM, {
    ...options,
    pushHead: "abc1234",
    pushedBy: new Map(),
  });

  assert.deepEqual(messages, []);
});

test("shared-planning-change-stages-SC-70 - messagesOf posts no landing reply for a change with no thread", () => {
  const base = new Map([["probe", at("probe")]]);
  const head = new Map([
    ["probe", at("probe", { landedBy: { tasks: "dana" } })],
  ]);

  const { messages } = messagesOf(base, head, TEAM, {
    ...options,
    pushHead: "abc1234",
    pushedBy: new Map([["probe", "dana"]]),
  });

  assert.deepEqual(messages, []);
});
