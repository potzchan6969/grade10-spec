import assert from "node:assert/strict";
import { test } from "node:test";

import {
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

test("classifies new, updated, archived, and removed changes", () => {
  const changes = classifyChanges(
    [
      { oldPath: null, path: "openspec/changes/new-change/proposal.md", status: "A" },
      { oldPath: "openspec/changes/active-change/spec.md", path: "openspec/changes/active-change/spec.md", status: "M" },
      { oldPath: "openspec/changes/old-change/proposal.md", path: null, status: "D" },
      {
        oldPath: "openspec/changes/finished-change/tasks.md",
        path: "openspec/changes/archive/2026-09-08-finished-change/tasks.md",
        status: "R",
      },
    ],
    {
      beforeActiveIds: new Set(["active-change", "old-change", "finished-change"]),
      afterActiveIds: new Set(["new-change", "active-change"]),
      beforeArchiveIds: new Set(),
      afterArchiveIds: new Set(["finished-change"]),
    },
  );

  assert.deepEqual(changes, {
    new: [{ id: "new-change", path: "new-change" }],
    updated: [{ id: "active-change", path: "active-change" }],
    archived: [{ id: "finished-change", path: "2026-09-08-finished-change" }],
    removed: [{ id: "old-change", path: "old-change" }],
  });
});

test("a deleted file inside an existing change is an update", () => {
  assert.deepEqual(
    classifyChanges(
      [{ oldPath: "openspec/changes/active-change/spec.md", path: null, status: "D" }],
      {
        beforeActiveIds: new Set(["active-change"]),
        afterActiveIds: new Set(["active-change"]),
      },
    ),
    {
      new: [],
      updated: [{ id: "active-change", path: "active-change" }],
      archived: [],
      removed: [],
    },
  );
});

test("does not report untouched changes when the diff is empty", () => {
  assert.deepEqual(
    classifyChanges([], {
      beforeActiveIds: new Set(["existing-change"]),
      afterActiveIds: new Set(["existing-change"]),
    }),
    { new: [], updated: [], archived: [], removed: [] },
  );
});

test("builds one Slack section for each changed status", () => {
  const payload = slackPayload({
    changes: {
      new: [{ id: "new-change", title: "Add a cart" }],
      updated: [{ id: "active-change", title: "Update <copy>" }],
      archived: [{ id: "finished-change", title: "Finish a change" }],
      removed: [{ id: "old-change", title: "Remove a change" }],
    },
    commitSha: "1234567890",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/1234567890",
    manualUrl: "https://spec.grade10-stg.com/planning",
  });

  assert.equal(payload.blocks.length, 6);
  assert.match(payload.blocks[1].text.text, /\*Add a cart\*/);
  assert.match(payload.blocks[2].text.text, /Update &lt;copy&gt;/);
  assert.match(payload.blocks.at(-1).elements[0].text, /1234567/);
});
