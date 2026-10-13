import assert from "node:assert/strict";
import { test } from "node:test";

import {
  behindText,
  escapeSlackText,
  linkedOf,
  threadPathOf,
  toldBodyOf,
  yourTurnText,
} from "./lib/wording.mjs";

/**
 * The words a message says, over nothing but their arguments — no git, no
 * team map, no filesystem.
 *
 * Their own suite because their own module: the push workflow sends these
 * sentences and the manual's Told now block shows them, so a case here is
 * what a hand reads wherever they read it. `moves.test.mjs` keeps the cases
 * about who a message reaches and what key stops it twice, and reads
 * `landedText` from here.
 */

const LINKED = "<https://spec.test/in-flight/probe|Probe>";

test("yourTurnText names the stage and pastes the hand's command", () => {
  assert.equal(
    yourTurnText({ id: "probe", stage: "planned" }, "dev", LINKED),
    `*Your turn* — ${LINKED} is at *Planned*.\nRead: \`/workflow-tasks probe\``,
  );
});

test("yourTurnText writes the change's own id into the command", () => {
  const text = yourTurnText(
    { id: "add-gift-cards", stage: "building" },
    "dev",
    LINKED,
  );

  assert.match(text, /`\/workflow-build add-gift-cards <group>`/);
  assert.doesNotMatch(text, /<id>/);
});

test("yourTurnText says the stage alone where the hand has no move at it", () => {
  assert.equal(
    yourTurnText({ id: "probe", stage: "archived" }, "qa", LINKED),
    `*Your turn* — ${LINKED} is at *Archived*.`,
  );
});

// Deployment availability has its own evidence path, so no stage sends QA a
// staging walk: implementation complete is the ordinary Your turn.
test("toldBodyOf gives QA at Implementation complete the ordinary Your turn", () => {
  assert.deepEqual(
    toldBodyOf({ id: "probe", stage: "implementation-complete" }, "qa", {
      linked: LINKED,
      sheetUrl: "https://sheets.test/run",
    }),
    {
      kind: "your-turn",
      text: yourTurnText(
        { id: "probe", stage: "implementation-complete" },
        "qa",
        LINKED,
      ),
    },
  );
});

test("toldBodyOf gives QA at another stage the ordinary Your turn", () => {
  assert.deepEqual(
    toldBodyOf({ id: "probe", stage: "planned" }, "qa", { linked: LINKED }),
    {
      kind: "your-turn",
      text: yourTurnText({ id: "probe", stage: "planned" }, "qa", LINKED),
    },
  );
});

// Proves part of shared-planning-agent-rounds-US11-TC1-1.
test("shared-planning-agent-rounds-SC-89 - a direct QA body at Specified carries no review task", () => {
  const at = {
    id: "probe",
    stage: "specified",
    suites: [
      {
        spec: "shared/planning/agent-rounds",
        path: "openspec/changes/probe/specs/shared/planning/agent-rounds/feature-tcs.md",
        cases: { draft: 35, actual: 0, deprecated: 0, total: 35, automated: 0 },
      },
    ],
  };
  const body = toldBodyOf(at, "qa", { linked: LINKED });
  assert.equal(body.kind, "your-turn");
  assert.equal(body.text, `*Your turn* — ${LINKED} is at *Specified*.`);
  assert.doesNotMatch(body.text, /tcs-review|Suite:/);
});

test("shared-planning-agent-rounds-SC-89 - QA's ordinary body names no suite", () => {
  const cases = { draft: 0, actual: 3, deprecated: 0, total: 3, automated: 0 };
  const at = {
    id: "probe",
    stage: "specified",
    suites: [
      { spec: "a/signed", status: "approved", cases },
      { spec: "a/broken", error: "no cases", cases: { ...cases, total: 0 } },
    ],
  };
  assert.doesNotMatch(toldBodyOf(at, "qa", { linked: LINKED }).text, /Suite:/);
});

test("behindText names the artifact and what changed before it", () => {
  assert.equal(
    behindText({ artifact: "tasks", changed: ["decisions", "specs"] }, LINKED),
    `*Behind* — \`tasks\` on ${LINKED} is behind \`decisions\`, \`specs\`.`,
  );
});

test("behindText names what it was drawn from where nothing singles an item out", () => {
  assert.match(
    behindText({ artifact: "tasks", changed: [] }, LINKED),
    /is behind what it was drawn from\.$/,
  );
});

test("threadPathOf writes the path Slack resolves, the separator taken out", () => {
  assert.equal(
    threadPathOf("C0123ABC/1758170000.001200"),
    "/archives/C0123ABC/p1758170000001200",
  );
});

test("threadPathOf says nothing for a record that names no thread", () => {
  for (const thread of [undefined, "", "C0123ABC", "/1758170000.001200"]) {
    assert.equal(threadPathOf(thread), undefined);
  }
});

test("linkedOf links a title, escaped, in Slack's own markup", () => {
  assert.equal(
    linkedOf("https://spec.test/in-flight/probe", "Gift cards & <vouchers>"),
    "<https://spec.test/in-flight/probe|Gift cards &amp; &lt;vouchers&gt;>",
  );
});

test("escapeSlackText turns the three characters Slack reads as markup into entities", () => {
  assert.equal(escapeSlackText("A & <b> c"), "A &amp; &lt;b&gt; c");
});
