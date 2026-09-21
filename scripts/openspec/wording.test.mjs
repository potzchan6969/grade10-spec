import assert from "node:assert/strict";
import { test } from "node:test";

import {
  behindText,
  escapeSlackText,
  linkedOf,
  stagingText,
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
    yourTurnText({ id: "probe", stage: "released" }, "release", LINKED),
    `*Your turn* — ${LINKED} is at *Released*.`,
  );
});

test("stagingText names the run sheet it was given", () => {
  assert.equal(
    stagingText(LINKED, "https://sheets.test/run"),
    `*On staging* — ${LINKED} is on staging. Walk <https://sheets.test/run|the run sheet>.`,
  );
});

test("stagingText names the run sheet in words where none is configured", () => {
  assert.equal(
    stagingText(LINKED, undefined),
    `*On staging* — ${LINKED} is on staging. Walk the run sheet.`,
  );
});

test("shared-planning-change-stages-SC-45 - stagingText names the build the deploy recorded", () => {
  assert.equal(
    stagingText(LINKED, "https://sheets.test/run", "1.4.0-rc2"),
    `*On staging* — ${LINKED} is on staging, build \`1.4.0-rc2\`. Walk <https://sheets.test/run|the run sheet>.`,
  );
});

test("shared-planning-change-stages-SC-45 - toldBodyOf carries the record's build into QA's message", () => {
  assert.deepEqual(
    toldBodyOf(
      { id: "probe", stage: "on-staging", deployedBuild: "1.4.0-rc2" },
      "qa",
      {
        linked: LINKED,
        sheetUrl: undefined,
      },
    ),
    { kind: "staging", text: stagingText(LINKED, undefined, "1.4.0-rc2") },
  );
});

test("toldBodyOf sends QA to the run sheet on staging, with the sheet linked", () => {
  assert.deepEqual(
    toldBodyOf({ id: "probe", stage: "on-staging" }, "qa", {
      linked: LINKED,
      sheetUrl: "https://sheets.test/run",
    }),
    { kind: "staging", text: stagingText(LINKED, "https://sheets.test/run") },
  );
});

test("toldBodyOf gives every other hand of staging the ordinary Your turn", () => {
  assert.deepEqual(
    toldBodyOf({ id: "probe", stage: "on-staging" }, "release", {
      linked: LINKED,
      sheetUrl: "https://sheets.test/run",
    }),
    {
      kind: "your-turn",
      text: yourTurnText(
        { id: "probe", stage: "on-staging" },
        "release",
        LINKED,
      ),
    },
  );
});

test("toldBodyOf gives QA at another stage the ordinary Your turn", () => {
  assert.deepEqual(
    toldBodyOf({ id: "probe", stage: "specified" }, "qa", { linked: LINKED }),
    {
      kind: "your-turn",
      text: yourTurnText({ id: "probe", stage: "specified" }, "qa", LINKED),
    },
  );
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
