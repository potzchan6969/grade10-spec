import assert from "node:assert/strict";
import { test } from "node:test";

import {
  classifyCapabilities,
  classifyChanges,
  parseChangedFiles,
  slackPayload,
} from "./changed-changes.mjs";

test("parses regular and renamed OpenSpec files from git's NUL format", () => {
  assert.deepEqual(
    parseChangedFiles(
      "M\0openspec/changes/add-cart/proposal.md\0R100\0openspec/changes/add-cart/tasks.md\0openspec/changes/archive/2026-09-08-add-cart/tasks.md\0",
    ),
    [
      {
        oldPath: null,
        path: "openspec/changes/add-cart/proposal.md",
        status: "M",
      },
      {
        oldPath: "openspec/changes/add-cart/tasks.md",
        path: "openspec/changes/archive/2026-09-08-add-cart/tasks.md",
        status: "R",
      },
    ],
  );
});

test("classifies file additions, updates, archive moves, and removals by scope", () => {
  const changes = classifyChanges(
    [
      { oldPath: null, path: "openspec/changes/new-change/proposal.md", status: "A" },
      { oldPath: null, path: "openspec/changes/active-change/tech-design.md", status: "A" },
      { oldPath: null, path: "openspec/changes/active-change/specs/store/spec.md", status: "M" },
      { oldPath: null, path: "openspec/changes/old-change/proposal.md", status: "D" },
      {
        oldPath: "openspec/changes/finished-change/tasks.md",
        path: "openspec/changes/archive/2026-09-08-finished-change/tasks.md",
        status: "R",
      },
    ],
  );

  assert.deepEqual(changes, {
    new: [
      { id: "active-change", path: "active-change", scopes: ["tech-design"] },
      { id: "new-change", path: "new-change", scopes: ["proposal"] },
    ],
    updated: [
      { id: "active-change", path: "active-change", scopes: ["spec"] },
    ],
    archived: [
      {
        id: "finished-change",
        path: "2026-09-08-finished-change",
        scopes: ["tasks"],
      },
    ],
    removed: [{ id: "old-change", path: "old-change", scopes: ["proposal"] }],
  });
});

test("classifies a deleted file inside an existing change as removed", () => {
  assert.deepEqual(
    classifyChanges(
      [{ oldPath: null, path: "openspec/changes/active-change/spec.md", status: "D" }],
    ),
    {
      new: [],
      updated: [],
      archived: [],
      removed: [{ id: "active-change", path: "active-change", scopes: ["spec"] }],
    },
  );
});

test("does not report untouched changes when the diff is empty", () => {
  assert.deepEqual(classifyChanges([]), {
    new: [],
    updated: [],
    archived: [],
    removed: [],
  });
});

test("classifies durable capability files by capability and scope", () => {
  assert.deepEqual(
    classifyCapabilities([
      {
        oldPath: null,
        path: "openspec/specs/grade10-site/auction/winner-journey/spec.md",
        status: "A",
      },
      {
        oldPath: null,
        path: "openspec/specs/grade10-site/auction/winner-journey/user-journeys.md",
        status: "M",
      },
      {
        oldPath: null,
        path: "openspec/specs/grade10-site/auction/winner-journey/test-cases.md",
        status: "D",
      },
    ]),
    {
      new: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["spec"],
        },
      ],
      updated: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["user-journeys"],
        },
      ],
      archived: [],
      removed: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["test-cases"],
        },
      ],
    },
  );
});

test("builds one Slack section for each changed status", () => {
  const payload = slackPayload({
    changes: {
      new: [{ id: "new-change", title: "Add a cart", scopes: ["proposal", "spec"] }],
      updated: [{ id: "active-change", title: "Update <copy>", scopes: ["tech-design"] }],
      archived: [{ id: "finished-change", title: "Finish a change", scopes: ["tasks"] }],
      removed: [{ id: "old-change", title: "Remove a change", scopes: ["proposal"] }],
    },
    commitSha: "1234567890",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/1234567890",
    manualUrl: "https://spec.grade10-stg.com/planning",
    openspecUrl: "https://spec.grade10-stg.com/openspec/",
  });

  assert.equal(payload.blocks.length, 5);
  assert.equal(
    payload.blocks[0].text.text,
    ":new: OpenSpec *New*\n- <https://spec.grade10-stg.com/openspec/#/change/new-change|Add a cart> (`new-change`) — `proposal`, `spec`",
  );
  assert.match(
    payload.blocks[0].text.text,
    /<https:\/\/spec\.grade10-stg\.com\/openspec\/#\/change\/new-change\|Add a cart> \(`new-change`\) — `proposal`, `spec`/,
  );
  assert.equal(
    payload.blocks[1].text.text,
    ":pencil2: OpenSpec *Updated*\n- <https://spec.grade10-stg.com/openspec/#/change/active-change|Update &lt;copy&gt;> (`active-change`) — `tech-design`",
  );
  assert.match(payload.blocks[1].text.text, /Update &lt;copy&gt;.*`tech-design`/);
  assert.match(payload.blocks[2].text.text, /^:file_cabinet: OpenSpec \*Archived\*\n/);
  assert.match(payload.blocks[3].text.text, /^:wastebasket: OpenSpec \*Removed\*\n/);
  assert.match(payload.blocks.at(-1).elements[0].text, /1234567/);
});

test("includes durable capability links in the Slack payload", () => {
  const payload = slackPayload({
    changes: { new: [], updated: [], archived: [], removed: [] },
    capabilities: {
      new: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["spec"],
        },
      ],
      updated: [],
      archived: [],
      removed: [],
    },
    commitSha: "1234567890",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/1234567890",
    manualUrl: "https://spec.grade10-stg.com/planning",
    openspecUrl: "https://spec.grade10-stg.com/openspec/",
  });

  assert.equal(
    payload.blocks[0].text.text,
    ":new: OpenSpec *New capabilities*\n- <https://spec.grade10-stg.com/openspec/#/spec/grade10-site/auction/winner-journey|grade10-site/auction/winner-journey> — `spec`",
  );
});
