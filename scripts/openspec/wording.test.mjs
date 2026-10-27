import assert from "node:assert/strict";
import { test } from "node:test";

import {
  escapeSlackText,
  linkedOf,
  movedText,
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

const LINKED = "<https://spec.test/openspec/#/change/probe|Probe>";

test("shared-planning-change-stages-SC-88 - yourTurnText names the stage and pastes the hand's command", () => {
  assert.equal(
    yourTurnText({ id: "probe", stage: "planned" }, "dev", LINKED),
    `*Your turn* — ${LINKED} is at *Planned*.\nRead the plan and challenge the tech design: \`/workflow-tasks probe\``,
  );
  assert.equal(
    yourTurnText({ id: "probe", stage: "specified" }, "pm", LINKED),
    `*Your turn* — ${LINKED} is at *Specified*.\nResolve the open Raised rows: \`/workflow-specify probe\``,
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

test("shared-planning-agent-rounds-US-18 - movedText says a small move holds nothing but the fold", () => {
  const text = movedText(
    {
      behind: [
        {
          artifact: "tasks",
          changed: ["proposal"],
          moved: [
            {
              item: "proposal",
              key: "## Why",
              before: "Why one.",
              after: "Why two.",
              major: false,
            },
          ],
          holds: false,
        },
      ],
    },
    LINKED,
  );
  assert.equal(
    text,
    [
      `*What moved* on ${LINKED}, before \`tasks\``,
      "`proposal` ## Why, small — before: Why one. — after: Why two.",
      "Holds nothing but the fold: read it again when you can.",
    ].join("\n"),
  );
});

test("movedText quotes a unit once however many artifacts it reaches, and names a whole move", () => {
  const unit = {
    item: "decisions",
    key: "Q3",
    before: "Every move holds",
    after: "A major move holds",
    major: true,
  };
  const text = movedText(
    {
      behind: [
        {
          artifact: "ui-design",
          changed: ["decisions"],
          moved: [unit],
          holds: true,
        },
        {
          artifact: "tasks",
          changed: ["decisions"],
          moved: [unit],
          holds: true,
        },
        {
          artifact: "specs",
          changed: ["ui-design"],
          whole: true,
          moved: [{ item: "ui-design", key: "ui-design", major: true }],
          holds: true,
        },
      ],
    },
    LINKED,
  );
  assert.equal(text.match(/`decisions` Q3/g)?.length, 1);
  assert.match(text, /`ui-design`, major — read it again whole/);
  assert.match(
    text,
    /Holds every landing after `ui-design`, `tasks`, `specs` until you read it again or land it\./,
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
    linkedOf(
      "https://spec.test/openspec/#/change/probe",
      "Gift cards & <vouchers>",
    ),
    "<https://spec.test/openspec/#/change/probe|Gift cards &amp; &lt;vouchers&gt;>",
  );
});

test("escapeSlackText turns the three characters Slack reads as markup into entities", () => {
  assert.equal(escapeSlackText("A & <b> c"), "A &amp; &lt;b&gt; c");
});
